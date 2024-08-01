import { NextFunction, Request, Response } from 'express';
import usersAction from '@/actions/users.action';
import authAction from '@/actions/auth.action';
import { User } from '@/types/express';

export class AuthController {
  public testFindUser = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { email } = req.user as User;

      const user = await usersAction.findUserByEmailOrUsername(
        email,
        undefined,
      );

      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  };

  // return void
  public createUserController = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { username, email, password, referrerCode, roleId } = req.body;

      const result = await authAction.createUser(
        username,
        email,
        password,
        referrerCode,
        Number(roleId),
      );

      res
        .status(201)
        .cookie('access-token', result.accessToken)
        .cookie('refresh-token', result.refreshToken)
        .json({ message: 'Create user success', result });
    } catch (error) {
      next(error);
    }
  };

  public loginController = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { email, password } = req.body;

      const result = await authAction.login(email, password);

      res
        .status(200)
        .cookie('access-token', result.accessToken)
        .cookie('refresh-token', result.refreshToken)
        .json({ message: 'Login success', result });
    } catch (error) {
      next(error);
    }
  };

  public refreshTokenController = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { email } = req.user as User;

      const result = await authAction.refreshToken(email);

      res
        .status(200)
        .cookie('access-token', result.accessToken)
        .json({ message: 'Refresh token success', result });
    } catch (error) {
      next(error);
    }
  };

  public verifyEmailController = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const { email } = req.user as User;
    try {
      await authAction.verifyEmail(email);

      res.status(200).send('Email verified successfully');
    } catch (error) {
      next(error);
    }
  };
}
