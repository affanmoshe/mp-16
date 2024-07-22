import { NextFunction, Request, Response } from 'express';
import ticketsActions from '@/actions/tickets.actions';

export class TicketController {
  private errorHandler(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }

  public createTicketController = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { eventId, customerId, transactionId, price, status } = req.body;

      const ticket = await ticketsActions.createTicket(
        eventId,
        customerId,
        transactionId,
        price,
        status
      );

      res.status(201).json({
        message: 'Ticket created successfully',
        data: ticket,
      });
    } catch (error) {
      next(error);
    }
  };

  public getAllTicketsController = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const tickets = await ticketsActions.getAllTickets();
      res.status(200).json(tickets);
    } catch (error) {
      next(error);
    }
  };

  public getTicketsByEventIdController = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const eventId = parseInt(req.params.eventId);
      const tickets = await ticketsActions.getTicketsByEventId(eventId);
      res.status(200).json(tickets);
    } catch (error) {
      next(error);
    }
  };

  public updateTicketByIdController = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const ticketId = parseInt(req.params.id);
      const { price, status } = req.body;

      const updatedTicket = await ticketsActions.updateTicketById(
        ticketId,
        price,
        status
      );

      res.status(200).json({
        message: 'Ticket updated successfully',
        data: updatedTicket,
      });
    } catch (error) {
      next(error);
    }
  };

  public deleteTicketByIdController = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const ticketId = parseInt(req.params.id);
      const deletedTicket = await ticketsActions.deleteTicketById(ticketId);
      res.status(200).json({
        message: 'Ticket deleted successfully',
        data: deletedTicket,
      });
    } catch (error) {
      next(error);
    }
  };
}

export default new TicketController();
