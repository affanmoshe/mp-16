import { NextFunction, Request, Response } from 'express';
import promotionAction from '../actions/promotion.action';
import { User } from '@/types/express';

export class PromotionController {
  private errorHandler(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }

  public createPromotionController = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } = req.user as User;
      const { eventId, code, discountAmount, usageLimit, validFrom, validTo } =
        req.body;

      const promotion = await promotionAction.createPromotionAction(
        Number(eventId),
        code,
        discountAmount,
        usageLimit,
        validFrom,
        validTo,
      );

      res.status(201).json({
        message: 'Promotion created successfully',
        data: promotion,
      });
    } catch (error) {
      next(error);
    }
  };

  public getAllPromotionsController = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const promotions = await promotionAction.getAllPromotions();
      res.status(200).json(promotions);
    } catch (error) {
      next(error);
    }
  };

  public getPromotionByIdController = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const promotionId = parseInt(req.params.id);
      const promotion = await promotionAction.getPromotionById(promotionId);
      res.status(200).json(promotion);
    } catch (error) {
      next(error);
    }
  };

  public updatePromotionController = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { promotionId } = req.params;
      const parsedPromotionId = parseInt(promotionId);
      const { discountAmount, usageLimit, validFrom, validTo } = req.body;

      const updatedPromotion = await promotionAction.updatePromotionAction(
        parsedPromotionId,
        discountAmount,
        usageLimit,
        validFrom,
        validTo,
      );

      res.status(200).json({
        message: 'Promotion updated successfully',
        data: updatedPromotion,
      });
    } catch (error) {
      next(error);
    }
  };

  public deletePromotionController = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const promotionId = parseInt(req.params.id);
      const deletedPromotion =
        await promotionAction.deletePromotionAction(promotionId);
      res.status(200).json({
        message: 'Promotion deleted successfully',
        data: deletedPromotion,
      });
    } catch (error) {
      next(error);
    }
  };
}

export default new PromotionController();
