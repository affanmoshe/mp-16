import { Router } from 'express';
// import { UsersController } from '@/controllers/users.contoller';
import { validateUserRegister } from '@/middlewares/users.validator';
import { AuthMiddleware } from '@/middlewares/auth.middleware';
import { AuthController } from '@/controllers/auth.contoller';
import { OrganizersController } from '@/controllers/organizers.contoller';

export class OrganizersRouter {
  private router: Router;
  private authController: AuthController;
  private organizersController: OrganizersController;
  private guard: AuthMiddleware;

  constructor() {
    this.authController = new AuthController();
    this.organizersController = new OrganizersController();
    this.guard = new AuthMiddleware();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // for accessing organizer data publicly (unauthenticated)
    // this.router.get(
    //   '/:username',
    //   this.organizersController.organizerProfileController,
    // );

    this.router.get(
      '/events',
      this.guard.verifyAccessToken,
      this.guard.verifyRole('ORGANIZER'),
      this.organizersController.getOrganizerAllEventsController,
    );

    this.router.get(
      '/events/:eventId',
      this.guard.verifyAccessToken,
      this.guard.verifyRole('ORGANIZER'),
      this.organizersController.getOrganizerEventByIdController,
    );

    this.router.get(
      '/promotion-count/:eventId',
      this.guard.verifyAccessToken,
      this.guard.verifyRole('ORGANIZER'),
      this.organizersController.getEventPromotionCountController,
    );

    this.router.get(
      '/transactions/:eventId',
      this.guard.verifyAccessToken,
      this.guard.verifyRole('ORGANIZER'),
      this.organizersController.getEventTransactionController,
    );

    this.router.get(
      '/transactions-stats/:eventId',
      this.guard.verifyAccessToken,
      this.guard.verifyRole('ORGANIZER'),
      this.organizersController.getTransactionStatsController,
    );

    this.router.get(
      '/revenue-count/:eventId',
      this.guard.verifyAccessToken,
      this.guard.verifyRole('ORGANIZER'),
      this.organizersController.getEventRevenueController,
    );

    this.router.get(
      '/ticket-count/:eventId',
      this.guard.verifyAccessToken,
      this.guard.verifyRole('ORGANIZER'),
      this.organizersController.getEventTicketCountController,
    );

    this.router.get(
      '/tickets/:eventId',
      this.guard.verifyAccessToken,
      this.guard.verifyRole('ORGANIZER'),
      this.organizersController.getEventTicketController,
    );

    this.router.get(
      '/reviews/:eventId',
      this.guard.verifyAccessToken,
      this.guard.verifyRole('ORGANIZER'),
      this.organizersController.getEventReviewsController,
    );

    this.router.get(
      '/promotions/:eventId',
      this.guard.verifyAccessToken,
      this.guard.verifyRole('ORGANIZER'),
      this.organizersController.getEventPromotionsController,
    );

    this.router.get(
      '/test',
      this.guard.verifyAccessToken,
      this.guard.verifyRole('ORGANIZER'),
      this.authController.testFindUser,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
