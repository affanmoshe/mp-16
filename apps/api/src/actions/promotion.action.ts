import prisma from '../prisma';

class PromotionAction {
  public createPromotionAction = async (
    eventId: number,
    code: string,
    discountAmount: number,
    usageLimit: number,
    validFrom: Date,
    validTo: Date,
  ) => {
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
  };

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

  public updatePromotionAction = async (
    promotionId: number,
    discountAmount: number,
    usageLimit: number,
    validFrom: Date,
    validTo: Date,
  ) => {
    try {
      let fields = {};

      if (discountAmount) fields = { ...fields, discountAmount };
      if (usageLimit) fields = { ...fields, usageLimit };
      if (validFrom) fields = { ...fields, validFrom };
      if (validTo) fields = { ...fields, validTo };

      const promotion = await prisma.promotion.update({
        where: {
          id: promotionId,
        },
        data: {
          ...fields,
        },
      });

      return promotion;
    } catch (error) {
      throw error;
    }
  };

  public deletePromotionAction = async (id: number) => {
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
  };
}

export default new PromotionAction();
