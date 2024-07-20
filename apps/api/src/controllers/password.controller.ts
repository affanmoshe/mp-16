import { NextFunction, Request, Response } from 'express';
import prisma from '@/prisma';
import passwordAction from '@/actions/password.action';

export class PasswordController {
  // check if email is a valid user then send mail contains reset link
  public resetRequestController = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { email } = req.body;

      const isResetPasswordEmailSent =
        await passwordAction.resetRequestAction(email);

      res.status(200).json({
        message: 'Password reset link sent to your email',
        isResetPasswordEmailSent,
      });
    } catch (error) {
      next(error);
    }
  };

  // for resetting user password. this request is coming from the link inside email that `resetRequestController` sent.
  // IMPORTANT: TEMPORARY TOKEN IS PASSED VIA QUERY AND PASSWORD MUST BE INSIDE REQUEST BODY
  public resetController = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { token } = req.query as { token: string };
      const { password } = req.body;

      if (!token) throw new Error('Token is invalid');
      if (!password) throw new Error('New password must be provided');

      await passwordAction.resetAction(token, password);

      res.status(200).json({
        message: 'Password reset success. Please login with the new password',
      });
    } catch (error) {
      next(error);
    }
  };
}
