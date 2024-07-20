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

  public createUserController = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { username, email, password, referrerCode, roleId } = req.body;

      await authAction.createUser(
        username,
        email,
        password,
        referrerCode,
        roleId,
      );

      const userLogin = await authAction.login(email, password);

      res.status(201).json({
        message: 'Create user success',
        data: userLogin,
      });
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

      const user = await authAction.login(email, password);

      res
        .status(200)
        .cookie('access-token', user)
        .cookie('refresh-token', user)
        .json({ message: 'Login success', user });
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
      const { id } = req.user as User;

      const result = await authAction.refreshToken(id);

      res
        .status(200)
        .cookie('access-token', result)
        .cookie('refresh-token', result)
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
