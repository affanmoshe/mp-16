import prisma from '../prisma';
import PointsAction from './points.action';
import promotionAction from './promotion.action';
import discountsAction from './discounts.action';
import { PaymentStatus } from '@prisma/client';

class TransactionAction {
  public async createTransaction(
    customerId: number,
    eventId: number,
    ticketQuantity: number, // Number of tickets
    selectedDiscounts: { type: 'points' | 'promotion'; id: number }[],
    paymentStatus: PaymentStatus,
  ) {
    // Check if the event exists
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      throw new Error('Event not found');
    }

    // Calculate totalAmount based on ticketQuantity
    const totalAmount = event.price * ticketQuantity;
    let discountAmount = 0;
    let finalAmount = totalAmount;

    // Process points and promotion discounts
    for (const discount of selectedDiscounts) {
      if (discount.type === 'points') {
        const pointsDiscount = await PointsAction.redeemAction(
          discount.id,
          finalAmount,
        );
        discountAmount += finalAmount - pointsDiscount;
        finalAmount = pointsDiscount;
      } else if (discount.type === 'promotion') {
        const promotionDiscount = await discountsAction.applyDiscountAction(
          discount.id,
          finalAmount,
        );
        discountAmount += finalAmount - promotionDiscount;
        finalAmount = promotionDiscount;
      }
    }

    // Create transaction
    const transaction = await prisma.transaction.create({
      data: {
        customerId,
        eventId,
        amount: totalAmount,
        discount: discountAmount,
        finalAmount: finalAmount,
        paymentStatus,
      },
    });

    // Update promotion usage limits if any promotions were applied
    for (const discount of selectedDiscounts) {
      if (discount.type === 'promotion') {
        const promotion = await prisma.promotion.findUnique({
          where: { id: discount.id },
        });

        if (promotion && promotion.usageLimit > 0) {
          await promotionAction.updatePromotionAction(
            promotion.id,
            promotion.discountAmount,
            promotion.usageLimit - 1, // Decrement the usage limit by 1 per usage
            promotion.validFrom,
            promotion.validTo,
          );
        }
      }
    }

    return transaction;
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
