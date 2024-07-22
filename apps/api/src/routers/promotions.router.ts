import { Router } from 'express';
import { PromotionController } from '../controllers/promotion.controller';

export class PromotionRouter {
  private router: Router;
  private promotionController: PromotionController;

  constructor() {
    this.promotionController = new PromotionController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post('/create', this.promotionController.createPromotionController);
    this.router.get('/promotions', this.promotionController.getAllPromotionsController);
    this.router.get('/promotion?id', this.promotionController.getPromotionByIdController);
    this.router.patch('/update-promotion?id', this.promotionController.updatePromotionByIdController);
    this.router.delete('/delete-promotion?id', this.promotionController.deletePromotionByIdController);
  }

  getRouter(): Router {
    return this.router;
  }
}

export default new PromotionRouter().getRouter();
