import prisma from '../prisma';

class PromotionAction {
  public async createPromotion(
    eventId: number,
    code: string,
    discountAmount: number,
    usageLimit: number,
    validFrom: Date,
    validTo: Date
  ) {
    try {
      const promotion = await prisma.promotion.create({
        data: {
          eventId,
          code,
          discountAmount,
          usageLimit,
          validFrom,
          validTo,
        },
      });
      return promotion;
    } catch (error) {
      throw error;
    }
  }

  public async getAllPromotions() {
    try {
      const promotions = await prisma.promotion.findMany();
      return promotions;
    } catch (error) {
      throw error;
    }
  }

  public async getPromotionById(id: number) {
    try {
      const promotion = await prisma.promotion.findUnique({
        where: {
          id,
        },
      });
      return promotion;
    } catch (error) {
      throw error;
    }
  }

  public async updatePromotionById(
    id: number,
    discountAmount: number,
    usageLimit: number,
    validFrom: Date,
    validTo: Date
  ) {
    try {
      const promotion = await prisma.promotion.update({
        where: {
          id,
        },
        data: {
          discountAmount,
          usageLimit,
          validFrom,
          validTo,
        },
      });
      return promotion;
    } catch (error) {
      throw error;
    }
  }

  public async deletePromotionById(id: number) {
    try {
      const promotion = await prisma.promotion.delete({
        where: {
          id,
        },
      });
      return promotion;
    } catch (error) {
      throw error;
    }
  }
}

export default new PromotionAction();
