import { NextFunction, Request, Response } from 'express';
import { User } from '@/types/express';
import discountssAction from '@/actions/discounts.action';

export class DiscountsController {
  // public applyDiscountController = async (
  //   req: Request,
  //   res: Response,
  //   next: NextFunction,
  // ) => {
  //   try {
  //     const { id } = req.user as User;

  //     const discount = await discountssAction.applyDiscountAction(id);

  //     res.status(200).json({
  //       message: 'Apply discount success',
  //       discount,
  //     });
  //   } catch (error) {
  //     next(error);
  //   }
  // };

  public getDiscountController = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } = req.user as User;

      const discountRate = await discountssAction.getDiscountAction(id);

      res.status(200).json({
        discountRate,
      });
    } catch (error) {
      next(error);
    }
  };
}
