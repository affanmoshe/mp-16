import { TicketStatus } from '@prisma/client';
import prisma from '../prisma';

class TicketAction {
  public async createTicket(
    eventId: number,
    customerId: number,
    transactionId: number,
    price: number,
    status: TicketStatus,
  ) {
    try {
      const ticket = await prisma.ticket.create({
        data: {
          eventId,
          customerId,
          transactionId,
          price,
          status,
        },
      });
      return ticket;
    } catch (error) {
      throw error;
    }
  }

  public async getAllTickets() {
    try {
      const tickets = await prisma.ticket.findMany();
      return tickets;
    } catch (error) {
      throw error;
    }
  }

  public async getTicketsByEventId(eventId: number) {
    try {
      const tickets = await prisma.ticket.findMany({
        where: {
          eventId,
        },
      });
      return tickets;
    } catch (error) {
      throw error;
    }
  }

  public async updateTicketById(
    id: number,
    price: number,
    status: TicketStatus,
  ) {
    try {
      const ticket = await prisma.ticket.update({
        where: {
          id,
        },
        data: {
          price,
          status,
        },
      });
      return ticket;
    } catch (error) {
      throw error;
    }
  }

  public async deleteTicketById(id: number) {
    try {
      const ticket = await prisma.ticket.delete({
        where: {
          id,
        },
      });
      return ticket;
    } catch (error) {
      throw error;
    }
  }
}

export default new TicketAction();
