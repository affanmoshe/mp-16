import { Router } from 'express';
// import { UsersController } from '@/controllers/users.contoller';
// import {
//   validateUserRegister,
//   validateUserUpdate,
// } from '@/middlewares/users.validator';
import { AuthMiddleware } from '@/middlewares/auth.middleware';
import { PasswordController } from '@/controllers/password.controller';
import { validateResetPassword } from '@/middlewares/users.validator';

export class PasswordRouter {
  private router: Router;
  private passwordController: PasswordController;
  private guard: AuthMiddleware;

  constructor() {
    this.passwordController = new PasswordController();
    this.guard = new AuthMiddleware();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // passing email in body, then send email to user
    this.router.post(
      '/reset-password-request',
      this.passwordController.resetRequestController,
    );

    // passing token in query, and new password in body
    this.router.post(
      '/reset-password',
      validateResetPassword,
      this.passwordController.resetController,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
