import { PaymentStatus } from '@prisma/client';
import prisma from '../prisma';

class TransactionAction {
  public async createTransaction(
    customerId: number,
    eventId: number,
    amount: number,
    discount: number,
    finalAmount: number,
    promotionId: number,
    paymentStatus: PaymentStatus,
  ) {
    try {
      const transaction = await prisma.transaction.create({
        data: {
          customerId,
          eventId,
          amount,
          discount,
          finalAmount,
          promotionId,
          paymentStatus,
        },
      });
      return transaction;
    } catch (error) {
      throw error;
    }
  }

  public async getAllTransactions() {
    try {
      const transactions = await prisma.transaction.findMany();
      return transactions;
    } catch (error) {
      throw error;
    }
  }

  public async getTransactionsByCustomerId(customerId: number) {
    try {
      const transactions = await prisma.transaction.findMany({
        where: {
          customerId,
        },
      });
      return transactions;
    } catch (error) {
      throw error;
    }
  }

  public async updateTransactionById(
    id: number,
    amount: number,
    paymentStatus: PaymentStatus,
  ) {
    try {
      const transaction = await prisma.transaction.update({
        where: {
          id,
        },
        data: {
          amount,
          paymentStatus,
        },
      });
      return transaction;
    } catch (error) {
      throw error;
    }
  }

  public async deleteTransactionById(id: number) {
    try {
      const transaction = await prisma.transaction.delete({
        where: {
          id,
        },
      });
      return transaction;
    } catch (error) {
      throw error;
    }
  }
}

export default new TransactionAction();
