import prisma from '../prisma';
import authAction from './auth.action';

class UserAction {
  // IMPORTANT: for validating & checking purpose only! check whether the email or username are already used then return { id, username?, email? } or null if no user found
  public findUserByEmailOrUsername = async (
    email?: string,
    username?: string,
  ) => {
    if (!email && !username)
      throw new Error('Either email or username must be provided');

    try {
      const user = await prisma.user.findFirst({
        select: {
          id: true,
          username: true,
          email: true,
        },

        where: {
          OR: [
            email ? { email } : { email: undefined },
            username ? { username } : { username: undefined },
          ].filter(Boolean),
        },
      });

      return user
        ? {
            id: user.id,
            email: email ? user.email : undefined,
            username: username ? user.username : undefined,
          }
        : null;
    } catch (error) {
      throw error;
    }
  };

  // IMPORTANT: for self profile only. consume id from jwt then return user profile
  public findSelfById = async (id: number) => {
    try {
      const user = await prisma.user.findUnique({
        select: {
          username: true,
          email: true,
          referralCode: true,
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
        referralCode: user.referralCode,
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
  };

  // IMPORTANT: for self update only! consume id from jwt, data from req.body (each one are optional) then return user data
  public updateSelfById = async ({
    id,
    email,
    username,
    firstname,
    lastname,
    birthDate,
    phone,
    gender,
    avatar,
  }: {
    id: number;
    email?: string;
    username?: string;
    firstname?: string;
    lastname?: string;
    birthDate?: Date;
    phone?: string;
    gender?: string;
    avatar?: string;
  }) => {
    try {
      // check if the user id is valid
      const check = await this.findSelfById(id);
      if (!check) throw new Error('User not found');

      // fields for username and email update
      let fields = {};

      // check if the username is taken, add to fields if available
      if (username) {
        const checkUsername = await this.findUserByEmailOrUsername(
          undefined,
          username,
        );

        if (checkUsername) throw new Error('Username is taken');

        fields = { ...fields, username };
      }

      // check if the email is taken, add to fields if available
      if (email) {
        const checkEmail = await this.findUserByEmailOrUsername(
          email,
          undefined,
        );

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
      if (avatar) profile = { ...profile, avatar };

      // update user and profile table
      const result = await prisma.$transaction(async (tx) => {
        const user = await tx.user.update({
          select: {
            username: true,
            email: true,
            referralCode: true,
            isVerified: true,
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
                avatar: true,
                updatedAt: true,
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

        // if email updated, update isVerified to false and resend email verification
        if (email) {
          await tx.user.update({
            where: {
              id,
            },
            data: {
              isVerified: false,
            },
          });
          await authAction.sendVerifyEmail(email);
        }

        return user;
      });

      return result;
    } catch (error) {
      throw error;
    }
  };
}

export default new UserAction();
