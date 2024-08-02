import { NextFunction, Request, Response } from 'express';
import TransactionAction from '../actions/transaction.action';

export class TransactionController {
  private errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }

  public createTransactionController = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { customerId, eventId, ticketQuantity, selectedDiscounts, paymentStatus } = req.body;
      const transaction = await TransactionAction.createTransaction(
        customerId,
        eventId,
        ticketQuantity,
        selectedDiscounts,
        paymentStatus
      );
      res.status(201).json({
        message: 'Transaction created successfully',
        data: transaction,
      });
    } catch (error) {
      next(error);
    }
  };

  public getAllTransactionsController = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const transactions = await TransactionAction.getAllTransactions();
      res.status(200).json(transactions);
    } catch (error) {
      next(error);
    }
  };

  public getTransactionsByCustomerIdController = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const customerId = parseInt(req.params.customerId);
      const transactions = await TransactionAction.getTransactionsByCustomerId(customerId);
      res.status(200).json(transactions);
    } catch (error) {
      next(error);
    }
  };

  public updateTransactionByIdController = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const transactionId = parseInt(req.params.id);
      const { finalAmount, paymentStatus } = req.body;
      const updatedTransaction = await TransactionAction.updateTransactionById(transactionId, finalAmount, paymentStatus);
      res.status(200).json({
        message: 'Transaction updated successfully',
        data: updatedTransaction,
      });
    } catch (error) {
      next(error);
    }
  };

  public deleteTransactionByIdController = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const transactionId = parseInt(req.params.id);
      const deletedTransaction = await TransactionAction.deleteTransactionById(transactionId);
      res.status(200).json({
        message: 'Transaction deleted successfully',
        data: deletedTransaction,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new TransactionController();
