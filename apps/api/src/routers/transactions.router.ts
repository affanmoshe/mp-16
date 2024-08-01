import { Router } from 'express';
import { TransactionController } from '../controllers/transaction.controller';

export class TransactionRouter {
  private router: Router;
  private transactionController: TransactionController;

  constructor() {
    this.transactionController = new TransactionController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      '/create-transactions',
      this.transactionController.createTransactionController,
    );
    // this.router.post(
    //   '/create-many',
    //   this.transactionController.createManyTransaction,
    // );
    this.router.get(
      '/transactions',
      this.transactionController.getAllTransactionsController,
    );
    this.router.get(
      '/customer?id',
      this.transactionController.getTransactionsByCustomerIdController,
    );
    this.router.patch(
      '/transaction?id',
      this.transactionController.updateTransactionByIdController,
    );
    this.router.delete(
      '/transaction?id',
      this.transactionController.deleteTransactionByIdController,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}

export default new TransactionRouter().getRouter();
