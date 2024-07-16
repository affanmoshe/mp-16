import { compare, genSalt, hash } from 'bcrypt';
import prisma from '../prisma';
import { sign } from 'jsonwebtoken';
import { API_KEY } from '../config';

class UserAction {
  // register a user by passing { username, email, password, referrer code, and role id } then return { username, email, referralCode, role name }
  public async createUser(
    username: string,
    email: string,
    password: string,
    referrerCode?: string,
    roleId: number = 1,
  ) {
    try {
      // check whether the username or email has been used then return boolean (true if used, false if available)
      const check = await this.findUserByEmailOrUsername(email, username);

      if (check) throw new Error('Email or username already exist');

      const salt = await genSalt(10);
      const hashedPassword = await hash(password, salt);

      // run the loop function for generating and checking the referral code for each registered user then return the referral code
      const referralCode = await this.generateUniqueReferralCode();

      if (!referralCode) throw new Error('Please try again');

      // check whether the referred code is a valid code that belongs to a user then return referrer id
      let referrerId = null;
      if (referrerCode) {
        const referralCheck = await this.referrerCheckReturnId(referrerCode);

        referrerId = referralCheck;
      }

      // transaction function to ensure atomicity: check referrer code, record user, and record point if referrer code is valid then return created user
      await prisma.$transaction(async (tx) => {
        await tx.user.create({
          data: {
            username,
            email,
            password: hashedPassword,
            referralCode,
            referrerId,
            roleId,
            profile: {
              create: {},
            },
          },
          select: {
            username: true,
            email: true,
            referralCode: true,
            role: {
              select: {
                name: true,
              },
            },
          },
        });

        //
        if (referrerId) {
          const POINTS_EARNED = 10000;
          const MONTHS_UNTIL_EXPIRES = 3;

          const TODAY = new Date();
          const EXPIRY_DATE = TODAY.setMonth(
            TODAY.getMonth() + MONTHS_UNTIL_EXPIRES,
          );

          await tx.point.create({
            data: {
              pointsEarned: POINTS_EARNED,
              pointsRemaining: POINTS_EARNED,
              pointsExpiry: new Date(EXPIRY_DATE),
              pointsOwnerId: referrerId,
            },
          });
        }

        // return user;
      });

      // const payload = {
      //   username: result.username,
      //   email: result.email,
      //   referralCode: result.referralCode,
      //   role: result.role.name,
      // };

      // return payload;
    } catch (error) {
      throw error;
    }
  }

  // func for generating of the referral code for each registered user, then return the code
  private async generateReferralCode() {
    const length = 8;
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      code += charset[randomIndex];
    }
    return code;
  }

  // check whether the referral code is already used. if used it will re-generate and re-checked the code until the unique code found then return the code
  private async generateUniqueReferralCode() {
    try {
      let code;
      let isUnique = false;

      while (!isUnique) {
        code = await this.generateReferralCode();
        const existingUser = await prisma.user.findUnique({
          where: { referralCode: code },
        });

        if (!existingUser) {
          isUnique = true;
        }
      }

      return code;
    } catch (error) {
      throw error;
    }
  }

  // find user based on referrer code then return the referrer id
  private async referrerCheckReturnId(referrerCode: string) {
    try {
      const referrerValidation = await prisma.user.findFirst({
        select: {
          id: true,
        },
        where: {
          referralCode: referrerCode,
        },
      });

      if (!referrerValidation) throw new Error('Referral code not found');

      return referrerValidation.id;
    } catch (error) {
      throw error;
    }
  }

  // login action consume email & password then return jwt token
  public async login(email: string, password: string) {
    try {
      // check whether the email has been registered then return the user data
      const user = await prisma.user.findFirst({
        select: {
          id: true,
          username: true,
          email: true,
          password: true,
          role: {
            select: {
              name: true,
            },
          },
        },
        where: {
          email,
        },
      });

      // throw error when the returned user is empty
      if (!user) throw new Error('Email or password incorrect');

      // check whether the password is valid using compare bcrypt then return boolean
      const isValid = await compare(password, user.password);

      if (!isValid) throw new Error('Password is incorrect');

      const payload = {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role.name,
      };

      const token = sign(payload, String(API_KEY), { expiresIn: '24hr' });

      return token;
    } catch (error) {
      throw error;
    }
  }

  // IMPORTANT: for validating & checking purpose only! check whether the email or username are already used then return user id, null if no user found)
  public async findUserByEmailOrUsername(email: string, username: string) {
    try {
      const user = await prisma.user.findFirst({
        select: {
          id: true,
          username: true,
          email: true,
        },
        where: {
          OR: [
            {
              username,
            },
            { email },
          ],
        },
      });

      //

      if (!user) return null;
      return user?.id;
    } catch (error) {
      throw error;
    }
  }

  // IMPORTANT: for self profile only. consume id from jwt then return user profile
  public async findSelfById(id: number) {
    try {
      const user = await prisma.user.findFirst({
        select: {
          username: true,
          email: true,
          role: {
            select: {
              name: true,
            },
          },
          profile: {
            select: {
              firstname: true,
              lastname: true,
              birthDate: true,
              phone: true,
              gender: true,
            },
          },
          points: {
            select: {
              pointsRemaining: true,
              pointsExpiry: true,
            },
            where: {
              pointsExpiry: {
                gt: new Date(),
              },
            },
          },
        },
        where: {
          id,
        },
      });

      if (!user) throw new Error('User not found!');

      const payload = {
        email: user.email,
        username: user.username,
        role: user.role.name,
        firstname: user.profile?.firstname,
        lastname: user.profile?.lastname,
        birthDate: user.profile?.birthDate,
        phone: user.profile?.phone,
        gender: user.profile?.gender,
        points: user.points,
      };

      return payload;
    } catch (error) {
      throw error;
    }
  }

  // IMPORTANT: for self update only! consume id from jwt, data from req.body (each one are optional) then return user data
  public async updateSelfById(
    id: number,
    email: string,
    username: string,
    firstname: string,
    lastname: string,
    birthDate: Date,
    phone: string,
    gender: string,
  ) {
    try {
      // check if the user id is valid
      const check = await this.findSelfById(id);
      if (!check) throw new Error('User not found');

      // fields for username and email update
      let fields = {};

      // check if the username is taken, add to fields if available
      if (username) {
        const checkUsername = await this.findUserByEmailOrUsername(
          '',
          username,
        );

        if (checkUsername) throw new Error('Username is taken');

        fields = { ...fields, username };
      }

      // check if the email is taken, add to fields if available
      if (email) {
        const checkEmail = await this.findUserByEmailOrUsername(email, '');

        if (checkEmail) throw new Error('Email is already registered');

        fields = { ...fields, email };
      }

      // profile object for firstname, lastname, birthDate, phone, and gender
      let profile = {};

      // check if each fields is defined then add to profile object
      if (firstname) profile = { ...profile, firstname };
      if (lastname) profile = { ...profile, lastname };
      if (birthDate) profile = { ...profile, birthDate };
      if (phone) profile = { ...profile, phone };
      if (gender) profile = { ...profile, gender };

      // update user and profile table
      const user = await prisma.user.update({
        select: {
          username: true,
          email: true,
          referralCode: true,
          updatedAt: true,
          points: {
            select: {
              pointsRemaining: true,
              pointsExpiry: true,
            },
          },
          profile: {
            select: {
              firstname: true,
              lastname: true,
              birthDate: true,
              phone: true,
              gender: true,
            },
          },
        },
        where: {
          id,
        },
        data: {
          ...fields,
          profile: {
            update: {
              where: {
                customerId: id,
              },
              data: {
                ...profile,
              },
            },
          },
        },
      });

      return user;
    } catch (error) {
      throw error;
    }
  }
}

export default new UserAction();
