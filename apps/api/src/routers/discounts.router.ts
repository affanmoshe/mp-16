import { Router } from 'express';
import { AuthMiddleware } from '@/middlewares/auth.middleware';
import { DiscountsController } from '@/controllers/discounts.contoller';

export class DiscountsRouter {
  private router: Router;
  private discountssController: DiscountsController;
  private guard: AuthMiddleware;

  constructor() {
    this.discountssController = new DiscountsController();
    this.guard = new AuthMiddleware();
    this.router = Router();
    this.initializeRoutes();
  }

  // how to use:
  // - send a GET request to `/discounts/` to get the valid discount
  // - display the available discount rate to the user
  // - on transaction: use `applyDiscountAction` to calculate the price before use any promotion logic

  private initializeRoutes(): void {
    // passing auth bearer jwt only then return { discountRate }
    this.router.get(
      '/',
      this.guard.verifyAccessToken,
      this.guard.verifyRole('CUSTOMER'),
      this.discountssController.getDiscountController,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
