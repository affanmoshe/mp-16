import { Router } from 'express';
import { PromotionController } from '../controllers/promotion.controller';
import { AuthMiddleware } from '@/middlewares/auth.middleware';

export class PromotionRouter {
  private router: Router;
  private promotionController: PromotionController;
  private guard: AuthMiddleware;

  constructor() {
    this.promotionController = new PromotionController();
    this.guard = new AuthMiddleware();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      '/create',
      this.guard.verifyAccessToken,
      this.guard.verifyRole('ORGANIZER'),
      this.promotionController.createPromotionController,
    );

    this.router.get('/', this.promotionController.getAllPromotionsController);
    this.router.get(
      '/:promotionId',
      this.promotionController.getPromotionByIdController,
    );

    this.router.patch(
      '/update/:promotionId',
      this.guard.verifyAccessToken,
      this.guard.verifyRole('ORGANIZER'),
      this.promotionController.updatePromotionController,
    );
    this.router.delete(
      '/delete/:promotionId',
      this.guard.verifyAccessToken,
      this.guard.verifyRole('ORGANIZER'),
      this.promotionController.deletePromotionController,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}

export default new PromotionRouter().getRouter();
