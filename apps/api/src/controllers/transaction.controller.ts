import transactionAction from '@/actions/transaction.action';
import prisma from '@/prisma';
import { NextFunction, Request, Response } from 'express';
transactionAction;

export class TransactionController {
  private errorHandler(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }

  public createTransactionController = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const {
        customerId,
        eventId,
        amount,
        discount,
        finalAmount,
        promotionsId,
        paymentStatus,
      } = req.body;

      const transaction = await transactionAction.createTransaction(
        customerId,
        eventId,
        amount,
        discount,
        finalAmount,
        promotionsId,
        paymentStatus,
      );

      res.status(201).json({
        message: 'Transaction created successfully',
        data: transaction,
      });
    } catch (error) {
      next(error);
    }
  };

  public getAllTransactionsController = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const transactions = await transactionAction.getAllTransactions();
      res.status(200).json(transactions);
    } catch (error) {
      next(error);
    }
  };

  public getTransactionsByCustomerIdController = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const customerId = parseInt(req.params.customerId);
      const transactions =
        await transactionAction.getTransactionsByCustomerId(customerId);
      res.status(200).json(transactions);
    } catch (error) {
      next(error);
    }
  };

  public updateTransactionByIdController = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const transactionId = parseInt(req.params.id);
      const { totalAmount, paymentStatus } = req.body;

      const updatedTransaction = await transactionAction.updateTransactionById(
        transactionId,
        totalAmount,
        paymentStatus,
      );

      res.status(200).json({
        message: 'Transaction updated successfully',
        data: updatedTransaction,
      });
    } catch (error) {
      next(error);
    }
  };

  public deleteTransactionByIdController = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const transactionId = parseInt(req.params.id);
      const deletedTransaction =
        await transactionAction.deleteTransactionById(transactionId);
      res.status(200).json({
        message: 'Transaction deleted successfully',
        data: deletedTransaction,
      });
    } catch (error) {
      next(error);
    }
  };

  // public createManyTransaction = async (
  //   req: Request,
  //   res: Response,
  //   next: NextFunction,
  // ) => {
  //   try {
  //     const list = req.body;

  //     const final = list.map((item: any, index: number) => {
  //       return {
  //         customerId: Number(item.customerId),
  //         eventId: Number(item.eventId),
  //         paymentStatus: item.paymentStatus,
  //         createdAt: new Date(item.createdAt),
  //         amount: Number(item.amount),
  //         discount: Number(item.discount),
  //         finalAmount: Number(item.finalAmount),
  //       };
  //     });
  //     const create = await prisma.transaction.createMany({
  //       data: final,
  //     });

  //     res.status(200).json({
  //       message: 'Transaction updated successfully',
  //       data: create,
  //     });
  //   } catch (error) {
  //     next(error);
  //   }
  // };
}

export default new TransactionController();
