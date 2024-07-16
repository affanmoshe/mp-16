import { Router } from 'express';
import { UsersController } from '@/controllers/users.contoller';
import {
  validateUserRegister,
  validateUserUpdate,
} from '@/middlewares/users.validator';
import { AuthMiddleware } from '@/middlewares/auth.middleware';

export class UsersRouter {
  private router: Router;
  private usersController: UsersController;
  private guard: AuthMiddleware;

  constructor() {
    this.usersController = new UsersController();
    this.guard = new AuthMiddleware();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      '/register',
      validateUserRegister,
      this.usersController.createUserController,
    );

    this.router.post('/login', this.usersController.loginController);

    this.router.get(
      '/profile',
      this.guard.verifyToken,
      this.usersController.profileController,
    );

    this.router.patch(
      '/update-profile',
      validateUserUpdate,
      this.guard.verifyToken,
      this.usersController.updateUserController,
    );

    this.router.post('/test', this.usersController.testFindUser);
  }

  getRouter(): Router {
    return this.router;
  }
}
