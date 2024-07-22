import { NextFunction, Request, Response } from 'express';
import usersAction from '@/actions/users.action';
import { User } from '@/types/express';

export class UsersController {
  public profileController = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } = req.user as User;

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

      const { file } = req;
      const { email, username, firstname, lastname, birthDate, phone, gender } =
        req.body;

      const user = await usersAction.updateSelfById({
        id,
        email,
        username,
        firstname,
        lastname,
        birthDate,
        phone,
        gender,
        avatar: file?.filename,
      });

      res.status(200).json({
        message: 'Update user profile success',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };
}
