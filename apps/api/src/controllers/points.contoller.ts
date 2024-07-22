import { NextFunction, Request, Response } from 'express';
import { User } from '@/types/express';
import pointsAction from '@/actions/points.action';

export class PointsController {
  // public pointsRedeemController = async (
  //   req: Request,
  //   res: Response,
  //   next: NextFunction,
  // ) => {
  //   try {
  //     const { id } = req.user as User;
  //     const { pointsToRedeem } = req.body;

  //     const points = await pointsAction.redeemAction(id, pointsToRedeem);

  //     res.status(200).json({
  //       message: 'Redeem points success',
  //       points,
  //     });
  //   } catch (error) {
  //     next(error);
  //   }
  // };

  public getPointsController = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } = req.user as User;

      const points = await pointsAction.getAllPointsAction(id);

      res.status(200).json({
        points,
      });
    } catch (error) {
      next(error);
    }
  };
}
