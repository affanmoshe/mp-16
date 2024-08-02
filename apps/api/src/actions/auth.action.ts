import { compare, genSalt, hash } from 'bcrypt';
import fs from 'fs';
import * as handlebars from 'handlebars';
import path from 'path';
import prisma from '../prisma';
import { sign, verify } from 'jsonwebtoken';
import {
  ACCESS_TOKEN_SECRET,
  EMAIL_VERIFICATION_SECRET,
  FRONTEND_URL,
  NODEMAILER_EMAIL,
  REFRESH_TOKEN_SECRET,
} from '../config';
import usersAction from './users.action';
import { transporter } from '@/libs/nodemailer';

class AuthAction {
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
      const isUsernameOrEmailTaken =
        await usersAction.findUserByEmailOrUsername(email, username);

      if (isUsernameOrEmailTaken)
        throw new Error('Email or username already exist');

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

      // transaction function to ensure atomicity: check referrer code, record user, and record point if referrer code is valid, logging in, then return { accessToken, refreshToken }
      await prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
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
            id: true,
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

        // if (referrerId) {
        //   const POINTS_EARNED = 10000;
        //   const MONTHS_UNTIL_EXPIRES = 3;

        //   const TODAY = new Date();
        //   const EXPIRY_DATE = TODAY.setMonth(
        //     TODAY.getMonth() + MONTHS_UNTIL_EXPIRES,
        //   );

        //   await tx.point.create({
        //     data: {
        //       pointsEarned: POINTS_EARNED,
        //       pointsRemaining: POINTS_EARNED,
        //       pointsExpiry: new Date(EXPIRY_DATE),
        //       pointsOwnerId: referrerId,
        //     },
        //   });

        //   await tx.discount.create({
        //     data: {
        //       discountRate: 0.1,
        //       discountExpiry: new Date(EXPIRY_DATE),
        //       customerId: user.id,
        //     },
        //   });
        // }

        // await this.sendVerifyEmail(email);
      });

      const login = await this.login(email, password);

      return login;
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

  // login action consume email & password then return { accessToken, refreshToken }
  public login = async (email: string, password: string) => {
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
          isVerified: true,
          profile: {
            select: {
              avatar: true,
            },
          },
        },
        where: {
          email,
        },
      });

      // throw error when the returned user is empty
      if (!user) throw new Error('Email not found');

      // check whether the password is valid using compare bcrypt then return boolean
      const isValid = await compare(password, user.password);

      if (!isValid) throw new Error('Password is incorrect');

      const accessPayload = {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role.name,
        isVerified: user.isVerified,
        avatar: user.profile?.avatar,
      };

      const refreshPayload = {
        email: user.email,
      };

      const accessToken = sign(accessPayload, String(ACCESS_TOKEN_SECRET), {
        expiresIn: '30m',
      });

      const refreshToken = sign(refreshPayload, String(REFRESH_TOKEN_SECRET), {
        expiresIn: '24hr',
      });

      return { accessToken, refreshToken };
    } catch (error) {
      throw error;
    }
  };

  // refresh token action, consume id from jwt then return refreshed { accessToken }
  public refreshToken = async (email: string) => {
    try {
      // find user by its id from jwt
      const user = await prisma.user.findUnique({
        select: {
          id: true,
          username: true,
          email: true,
          role: {
            select: {
              name: true,
            },
          },
          isVerified: true,
          profile: {
            select: {
              avatar: true,
            },
          },
        },
        where: {
          email,
        },
      });

      // throw error when the returned user is empty
      if (!user) throw new Error('User not found');

      const payload = {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role.name,
        isVerified: user.isVerified,
        avatar: user.profile?.avatar,
      };

      const accessToken = sign(payload, String(ACCESS_TOKEN_SECRET), {
        expiresIn: '30m',
      });

      return { accessToken };
    } catch (error) {
      throw error;
    }
  };

  public sendVerifyEmail = async (email: string) => {
    try {
      const verifyEmailToken = sign(
        { email },
        String(EMAIL_VERIFICATION_SECRET),
        {
          expiresIn: '1hr',
        },
      );

      // nodemailer configuration
      const verificationLink = `${FRONTEND_URL}/verifikasi?token=${verifyEmailToken}`;

      const templatePath = path.join(
        __dirname,
        '../templates',
        'emailVerification.hbs',
      );
      const templateSource = fs.readFileSync(templatePath, 'utf-8');

      const compiledTemplate = handlebars.compile(templateSource);

      const html = compiledTemplate({
        action_url: verificationLink,
        support_url: 'https://example.com',
      });

      await transporter.sendMail({
        from: NODEMAILER_EMAIL,
        to: email,
        subject: 'Confirm Your Email Address',
        html,
      });
    } catch (error) {
      throw error;
    }
  };

  public verifyEmail = async (email: string) => {
    try {
      const check = await usersAction.findUserByEmailOrUsername(
        email,
        undefined,
      );

      if (!check) throw new Error('Email not found');

      await prisma.user.update({
        where: {
          id: check.id,
        },
        data: {
          isVerified: true,
        },
      });
    } catch (error) {
      throw error;
    }
  };
}

export default new AuthAction();
