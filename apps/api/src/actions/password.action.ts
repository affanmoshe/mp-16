import { genSalt, hash } from 'bcrypt';
import prisma from '../prisma';
import { FRONTEND_URL, NODEMAILER_EMAIL } from '../config';
import usersAction from './users.action';
import { transporter } from '@/libs/nodemailer';

export class PasswordAction {
  // for password reset request. check if email is a valid user, generate and update reset token to db, then send password reset url to user's email. return true (for validation)
  public resetRequestAction = async (email: string) => {
    try {
      const user = await usersAction.findUserByEmailOrUsername(
        email,
        undefined,
      );

      if (!user) throw new Error('User not found');

      //   create random token to be used as temporary reset token
      const resetToken = require('crypto').randomBytes(32).toString('hex');

      //   set token expiry to 1 hour expiry
      const NOW = new Date();
      const resetTokenExpiry = NOW.setHours(NOW.getHours() + 1);

      const resetLink = `${FRONTEND_URL}/reset-password?token=${resetToken}`;

      //   updating resetToken & resetTokenExpiry to db then send email to user (atomic)
      await prisma.$transaction(async (tx) => {
        await tx.user.update({
          where: {
            id: user.id,
          },
          data: {
            resetToken,
            resetTokenExpiry: new Date(resetTokenExpiry),
          },
        });

        await transporter.sendMail({
          from: NODEMAILER_EMAIL,
          to: email,
          subject: 'Password Reset',
          html: `<p>Please click <a href="${resetLink}">here</a> to change your password.</p>`,
        });
      });

      return true;
    } catch (error) {
      throw error;
    }
  };

  // for password reset, consume resetToken and new password then return void
  public resetAction = async (resetToken: string, password: string) => {
    try {
      const user = await prisma.user.findFirst({
        select: {
          id: true,
        },
        where: {
          resetToken,
          resetTokenExpiry: {
            gt: new Date(),
          },
        },
      });

      if (!user) throw new Error('Invalid or expired token');

      await prisma.$transaction(async (tx) => {
        const salt = await genSalt(10);
        const hashedPassword = await hash(password, salt);

        await tx.user.update({
          where: {
            id: user.id,
          },
          data: {
            password: hashedPassword,
            resetToken: null,
            resetTokenExpiry: null,
          },
        });
      });
    } catch (error) {
      throw error;
    }
  };
}

export default new PasswordAction();
