import prisma from '../prisma';

export class PointsAction {
  public applyDiscountAction = async (id: number, price: number) => {
    try {
      const discount = await prisma.discount.findFirst({
        where: {
          customerId: id,
          discountExpiry: {
            gt: new Date(),
          },
        },
      });

      // if no discount available, return the original price
      if (!discount) return price;

      // calculate the final price based on discount rate
      let finalPrice = price * (1 - discount.discountRate);

      await prisma.discount.delete({
        where: {
          id: discount.id,
        },
      });

      return finalPrice;
    } catch (error) {
      throw error;
    }
  };

  public getDiscountAction = async (id: number) => {
    try {
      const discountCoupon = await prisma.discount.findUnique({
        where: {
          customerId: id,
          discountExpiry: {
            gt: new Date(),
          },
        },
      });

      return discountCoupon?.discountRate || 0;
    } catch (error) {
      throw error;
    }
  };
}

export default new PointsAction();
