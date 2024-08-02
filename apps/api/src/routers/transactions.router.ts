import { Router } from 'express';
import transactionController, { TransactionController } from '@/controllers/transaction.controller'
export class TransactionRouter {
  private router: Router;
  private transactionController: TransactionController;

  constructor() {
    this.transactionController = new TransactionController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post('/create-transactions', this.transactionController.createTransactionController);
    this.router.get('/transactions', this.transactionController.getAllTransactionsController);
    this.router.get('/transactions/customer/:customerId', this.transactionController.getTransactionsByCustomerIdController);
    this.router.patch('/transactions/:id', this.transactionController.updateTransactionByIdController);
    this.router.delete('/transactions/:id', this.transactionController.deleteTransactionByIdController);
  }

  getRouter(): Router {
    return this.router;
  }
}

export default new TransactionRouter().getRouter();
