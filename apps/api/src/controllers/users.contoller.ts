import { NextFunction, Request, Response } from 'express';
import usersAction from '@/actions/users.action';
import { User } from '@/types/express';
// import prisma from '@/prisma';

export class UsersController {
  public testFindUser = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { username, email } = req.body;

      const user = await usersAction.findUserByEmailOrUsername(email, username);

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

      await usersAction.createUser(
        username,
        email,
        password,
        referrerCode,
        roleId,
      );

      const userLogin = await usersAction.login(email, password);

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

      const user = await usersAction.login(email, password);

      res.status(200).json({
        message: 'Login success',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };

  //
  public profileController = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id, username } = req.user as User;

      const user = await usersAction.findSelfById(id);

      res.status(200).json({
        message: 'Get user profile success',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };

  public updateUserController = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } = req.user as User;

      const { email, username, firstname, lastname, birthDate, phone, gender } =
        req.body;

      const user = await usersAction.updateSelfById(
        id,
        email,
        username,
        firstname,
        lastname,
        birthDate,
        phone,
        gender,
      );

      res.status(200).json({
        message: 'Update user profile success',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };
}
