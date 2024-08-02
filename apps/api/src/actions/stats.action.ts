import prisma from '../prisma';

export class StatsAction {
  public transactionStats = async (
    organizerId: number,
    eventId: number,
    startDate: string,
    endDate: string,
    interval: string,
  ) => {
    try {
      let data;
      switch (interval) {
        case 'year':
          data = await prisma.$queryRaw`
        SELECT
          DATE_FORMAT(createdAt, '%Y') AS date,
          SUM(amount) AS totalAmount,
          SUM(discount) AS totalDiscount
        FROM
          Transaction
        WHERE
          eventId = ${eventId}
        GROUP BY
          DATE_FORMAT(createdAt, '%Y')
        ORDER BY
          DATE_FORMAT(createdAt, '%Y');
        `;

          break;
        case 'month':
          data = await prisma.$queryRaw`
        SELECT
          DATE_FORMAT(createdAt, '%Y-%m') AS date,
          SUM(finalAmount) AS totalAmount,
          SUM(discount) AS totalDiscount
        FROM
          Transaction
        WHERE
          eventId = ${eventId}
        GROUP BY
          DATE_FORMAT(createdAt, '%Y-%m')
        ORDER BY
          DATE_FORMAT(createdAt, '%Y-%m');
        `;

          break;
        default:
          data = await prisma.$queryRaw`
        SELECT
          DATE_FORMAT(createdAt, '%Y-%m-%d') AS date,
          SUM(amount) AS totalAmount,          
          SUM(discount) AS totalDiscount
        FROM
          Transaction
        WHERE
          eventId = ${eventId}
        GROUP BY
          DATE_FORMAT(createdAt, '%Y-%m-%d')
        ORDER BY
          DATE_FORMAT(createdAt, '%Y-%m-%d');
        `;

          break;
      }

      const dateList = this.generateDateList(startDate, endDate, interval);
      const fullData = this.mergeWithDateList(dateList, data, interval);

      return fullData;
    } catch (error) {
      throw error;
    }
  };

  private generateDateList = (
    startDate: string,
    endDate: string | Date,
    interval: string,
  ) => {
    let dates = [];
    let currentDate = new Date(startDate);
    endDate = new Date(endDate);

    while (currentDate <= endDate) {
      let label;
      if (interval === 'year') {
        label = currentDate.getFullYear().toString();
        currentDate.setFullYear(currentDate.getFullYear() + 1);
      } else if (interval === 'month') {
        label = currentDate.toISOString().slice(0, 7); // YYYY-MM
        currentDate.setMonth(currentDate.getMonth() + 1);
      } else {
        // 'day'
        label = currentDate.toISOString().slice(0, 10); // YYYY-MM-DD
        currentDate.setDate(currentDate.getDate() + 1);
      }
      dates.push(label);
    }

    return dates;
  };

  private mergeWithDateList = (
    dateList: string[],
    transactions: any,
    interval: string,
  ) => {
    const amountMap = transactions.reduce((map: any, transaction: any) => {
      map[transaction.date] = transaction.totalAmount;
      return map;
    }, {});

    const discountMap = transactions.reduce((map: any, transaction: any) => {
      map[transaction.date] = transaction.totalDiscount;
      return map;
    }, {});

    return dateList.map((date) => ({
      date,
      totalAmount: amountMap[date.toString()] || 0,
      totalDiscount: discountMap[date.toString()] || 0,
    }));
  };
}

export default new StatsAction();
