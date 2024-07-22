import { Router } from 'express';
import { AuthMiddleware } from '@/middlewares/auth.middleware';
import {
  validatePointsToRedeem,
  validateResetPassword,
} from '@/middlewares/users.validator';
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

  private initializeRoutes(): void {
    // passing email in body, then send email to user

    //
    this.router.post(
      '/redeem',
      validatePointsToRedeem,
      this.guard.verifyAccessToken,
      this.guard.verifyRole('CUSTOMER'),
      this.pointsController.pointsRedeemController,
    );

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
