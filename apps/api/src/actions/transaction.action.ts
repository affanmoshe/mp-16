import prisma from '../prisma';

class TransactionAction {
  public async createTransaction(
    customerId: number,
    eventId: number,
    totalAmount: number,
    promotionsId: number,
    paymentStatus: string
  ) {
    try {
      const transaction = await prisma.transaction.create({
        data: {
          customerId,
          eventId,
          totalAmount,
          promotionsId,
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
    totalAmount: number,
    paymentStatus: string
  ) {
    try {
      const transaction = await prisma.transaction.update({
        where: {
          id,
        },
        data: {
          totalAmount,
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
