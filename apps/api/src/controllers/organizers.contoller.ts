import { NextFunction, Request, Response } from 'express';
import usersAction from '@/actions/users.action';
import { User } from '@/types/express';
import organizersAction from '@/actions/organizers.action';

export class OrganizersController {
  // for public use, consume username from params then return organizer profile
  public organizerProfileController = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { username } = req.params;

      const organizer = await organizersAction.findOrganizer(username);

      res.status(200).json({
        message: 'Get organizer profile success',
        data: organizer,
      });
    } catch (error) {
      next(error);
    }
  };
}
