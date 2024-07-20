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
    this.router.get(
      '/:username',
      this.organizersController.organizerProfileController,
    );

    this.router.get(
      '/test',
      this.guard.verifyToken,
      this.guard.verifyRole('ORGANIZER'),
      this.authController.testFindUser,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
