import { genSalt, hash } from 'bcrypt';
import prisma from '../prisma';
import { FRONTEND_URL } from '../config';
import usersAction from './users.action';
import { PaymentStatus } from '@prisma/client';

export class OrganizersAction {
  // IMPORTANT: for public use, do not return sensitive data
  public findOrganizer = async (username: string) => {
    try {
      const organizer = await prisma.user.findFirst({
        where: {
          AND: [
            { username },
            {
              role: {
                name: 'ORGANIZER',
              },
            },
          ],
        },
        select: {
          username: true,
          profile: {
            select: {
              firstname: true,
              lastname: true,
              avatar: true,
            },
          },
        },
      });

      // throw error when the returned organizer is empty
      if (!organizer) throw new Error('Organizer not found');

      const payload = {
        username: organizer.username,
        firstname: organizer.profile?.firstname,
        lastname: organizer.profile?.lastname,
        avatar: organizer.profile?.avatar,
      };

      return payload;
    } catch (error) {
      throw error;
    }
  };

  public getOrganizerAllEventsAction = async (
    id: number,
    page: string = '1',
    pageSize: string = '20',
  ) => {
    try {
      const parsedPage = Number(page);
      const parsedPageSize = Number(pageSize);

      // calculate the offset and limit
      const skip = (parsedPage - 1) * parsedPageSize;
      const take = parsedPageSize;

      const events = await prisma.user.findUnique({
        where: {
          id,
        },
        select: {
          _count: {
            select: {
              event: true,
            },
          },
          event: {
            orderBy: {
              createdAt: 'desc',
            },
            take,
            skip,
            select: {
              id: true,
              thumbnail: true,
              name: true,
              description: true,
              location: true,
              dateTime: true,
              ticketType: true,
              price: true,
              availableSeats: true,
              status: true,
              _count: {
                select: {
                  transaction: true,
                },
              },
              createdAt: true,
            },
          },
        },
      });

      return events;
    } catch (error) {
      throw error;
    }
  };

  public getEventAction = async (
    organizerId: number,
    eventId: number,
    fieldsToInclude: string[],
  ) => {
    const availableFields = [
      'thumbnail',
      'description',
      'location',
      'dateTime',
      'ticketType',
      'price',
      'availableSeats',
      'status',
      'promotion',
      'review',
      'transaction',
      'ticket',
      'createdAt',
    ];

    // build the `select` object
    const select: any = { id: true, name: true };
    availableFields.forEach((field) => {
      // set the field to true if it's included in the query
      select[field] = fieldsToInclude.includes(field);
    });

    try {
      const event = await prisma.event.findFirst({
        where: {
          id: eventId,
          organizerId,
        },
        select,
      });

      if (!event) throw new Error('Event not found');

      return event;
    } catch (error) {
      throw error;
    }
  };

  public getEventTransactionAction = async (
    organizerId: number,
    eventId: number,
    page: string = '1',
    pageSize: string = '30',
  ) => {
    try {
      const parsedPage = Number(page);
      const parsedPageSize = Number(pageSize);

      // calculate the offset and limit
      const skip = (parsedPage - 1) * parsedPageSize;
      const take = parsedPageSize;

      const transactions = await prisma.event.findUnique({
        where: {
          id: eventId,
          organizerId,
        },
        select: {
          _count: {
            select: {
              transaction: true,
            },
          },
          transaction: {
            select: {
              discount: true,
              finalAmount: true,
              paymentStatus: true,
              createdAt: true,
              promotion: {
                select: {
                  code: true,
                },
              },
              customer: {
                select: {
                  username: true,
                },
              },
            },
            orderBy: {
              createdAt: 'desc',
            },
            skip,
            take,
          },
        },
      });

      if (!transactions) throw new Error('Organizer unauthorized');

      return transactions;
    } catch (error) {
      throw error;
    }
  };

  public updateEventTransactionAction = async (
    organizerId: number,
    eventId: number,
    transactionId: number,
    paymentStatus: PaymentStatus,
  ) => {
    try {
      const transaction = await prisma.event.update({
        where: {
          id: eventId,
          organizerId,
        },
        data: {
          transaction: {
            update: {
              where: {
                id: transactionId,
              },
              data: {
                paymentStatus,
              },
            },
          },
        },
      });

      return transaction;
    } catch (error) {
      throw error;
    }
  };

  public getEventTicketCountAction = async (
    organizerId: number,
    eventId: number,
  ) => {
    try {
      const ticketAndTransactionCount = await prisma.event.findUnique({
        where: { id: eventId, organizerId },
        select: {
          _count: {
            select: {
              ticket: true,
              transaction: true,
            },
          },
        },
      });

      if (!ticketAndTransactionCount) throw new Error('Organizer unauthorized');

      return ticketAndTransactionCount;
    } catch (error) {
      throw error;
    }
  };

  public getEventTicketAction = async (
    organizerId: number,
    eventId: number,
    page: string = '1',
    pageSize: string = '40',
  ) => {
    try {
      const parsedPage = Number(page);
      const parsedPageSize = Number(pageSize);

      // calculate the offset and limit
      const skip = (parsedPage - 1) * parsedPageSize;
      const take = parsedPageSize;

      const tickets = await prisma.event.findUnique({
        where: {
          id: eventId,
          organizerId,
        },
        select: {
          _count: {
            select: {
              ticket: true,
            },
          },
          ticket: {
            select: {
              price: true,
              status: true,
              createdAt: true,
              customer: {
                select: {
                  username: true,
                  email: true,
                  profile: {
                    select: {
                      firstname: true,
                      lastname: true,
                      phone: true,
                    },
                  },
                },
              },
            },
            orderBy: {
              createdAt: 'desc',
            },
            skip,
            take,
          },
        },
      });

      if (!tickets) throw new Error('Organizer unauthorized');

      return tickets;
    } catch (error) {
      throw error;
    }
  };

  public getEventRevenueCountAction = async (
    organizerId: number,
    eventId: number,
  ) => {
    try {
      const checkOrganizerId = await prisma.event.findUnique({
        where: { id: eventId, organizerId },
        select: {
          name: true,
        },
      });

      if (!checkOrganizerId) throw new Error('Organizer unauthorized');

      const totalRevenue = await prisma.transaction.aggregate({
        where: {
          eventId,
        },
        _sum: {
          finalAmount: true,
          discount: true,
        },
      });

      return totalRevenue;
    } catch (error) {
      throw error;
    }
  };

  public getEventPromotionCountAction = async (
    organizerId: number,
    eventId: number,
  ) => {
    try {
      const promotionCount = await prisma.event.findUnique({
        where: { id: eventId, organizerId },
        select: {
          _count: {
            select: {
              promotion: true,
            },
          },
          promotion: {
            select: {
              _count: {
                select: {
                  transaction: true,
                },
              },
            },
          },
        },
      });

      if (!promotionCount) throw new Error('Organizer unauthorized');

      let sum_promotion_used = 0;
      for (let eachPromotion of promotionCount.promotion) {
        sum_promotion_used += eachPromotion._count.transaction;
      }

      return {
        promotion_count: promotionCount._count.promotion,
        sum_promotion_used,
      };
    } catch (error) {
      throw error;
    }
  };

  public getEventPromotionsAction = async (
    organizerId: number,
    eventId: number,
    page: string = '1',
    pageSize: string = '20',
  ) => {
    try {
      const parsedPage = Number(page);
      const parsedPageSize = Number(pageSize);

      // calculate the offset and limit
      const skip = (parsedPage - 1) * parsedPageSize;
      const take = parsedPageSize;

      const promotions = await prisma.event.findUnique({
        where: { id: eventId, organizerId },
        select: {
          _count: {
            select: {
              promotion: true,
            },
          },
          promotion: {
            include: {
              _count: {
                select: {
                  transaction: true,
                },
              },
            },

            orderBy: {
              createdAt: 'desc',
            },
            take,
            skip,
          },
        },
      });

      if (!promotions) throw new Error('Organizer unauthorized');

      return promotions;
    } catch (error) {
      throw error;
    }
  };

  public getEventReviewsAction = async (
    organizerId: number,
    eventId: number,
  ) => {
    try {
      const reviews = await prisma.event.findMany({
        where: { id: eventId, organizerId },
        select: {
          review: {
            select: {
              rating: true,
              reviewText: true,
              createdAt: true,
              customer: {
                select: {
                  username: true,
                  profile: {
                    select: {
                      avatar: true,
                      firstname: true,
                      lastname: true,
                    },
                  },
                },
              },
            },
            take: 5,
            orderBy: {
              createdAt: 'desc',
            },
          },
        },
      });

      if (!reviews) throw new Error('Organizer unauthorized');

      return reviews;
    } catch (error) {
      throw error;
    }
  };
}

export default new OrganizersAction();
