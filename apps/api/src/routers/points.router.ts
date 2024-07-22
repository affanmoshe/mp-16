import { Router } from 'express';
import { AuthMiddleware } from '@/middlewares/auth.middleware';
import { PointsController } from '@/controllers/points.contoller';

export class PointsRouter {
  private router: Router;
  private pointsController: PointsController;
  private guard: AuthMiddleware;

  constructor() {
    this.pointsController = new PointsController();
    this.guard = new AuthMiddleware();
    this.router = Router();
    this.initializeRoutes();
  }

  // how to use:
  // - send a GET request to `/points/` to get the total available points
  // - display the available points to the user
  // - on points selected reduce the price with available points
  // - on transaction: when the user decides to use points (add isPointUsed: boolean in transaction body), use `redeemAction` passing id and price, then return the new price

  private initializeRoutes(): void {
    // passing auth bearer jwt only
    this.router.get(
      '/',
      this.guard.verifyAccessToken,
      this.guard.verifyRole('CUSTOMER'),
      this.pointsController.getPointsController,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
