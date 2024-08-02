import { NextFunction, Request, Response } from 'express';
import usersAction from '@/actions/users.action';
import { User } from '@/types/express';
import organizersAction from '@/actions/organizers.action';
import prisma from '@/prisma';
import statsAction from '@/actions/stats.action';

export class OrganizersController {
  // for public use, consume username from params then return organizer profile
  public organizerProfileController = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { username } = req.params;

      const organizer = await organizersAction.findOrganizer(username);

      res.status(200).json({
        message: 'Get organizer profile success',
        data: organizer,
      });
    } catch (error) {
      next(error);
    }
  };

  public getOrganizerAllEventsController = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } = req.user as User;
      const { page, pageSize } = req.query;
      const allEvents = await organizersAction.getOrganizerAllEventsAction(
        id,
        page?.toString(),
        pageSize?.toString(),
      );

      res.status(200).json(allEvents);
    } catch (error) {
      next(error);
    }
  };

  public getOrganizerEventByIdController = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } = req.user as User;
      const { eventId } = req.params;
      const { include } = req.query;
      const parsedEventId = Number(eventId);

      // parse the `include` parameter
      const fieldsToInclude = include ? String(include).split(',') : [];

      const event = await organizersAction.getEventAction(
        id,
        parsedEventId,
        fieldsToInclude,
      );

      res.status(200).json(event);
    } catch (error) {
      next(error);
    }
  };

  public getTransactionStatsController = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } = req.user as User;
      const { eventId } = req.params;
      const parsedEventId = Number(eventId);
      const { startDate, endDate, interval } = req.query; // interval = 'daily', 'monthly', 'yearly'

      if (!startDate || !endDate || !interval)
        throw new Error('Start date, end date, and interval are required');

      const stats = await statsAction.transactionStats(
        id,
        parsedEventId,
        startDate?.toString(),
        endDate?.toString(),
        interval?.toString(),
      );

      res.status(200).json(stats);
    } catch (error) {
      next(error);
    }
  };

  public getEventTransactionController = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } = req.user as User;
      const { eventId } = req.params;
      const parsedEventId = Number(eventId);

      // get pagination parameters from the request query
      const { page, pageSize } = req.query;

      const transactions = await organizersAction.getEventTransactionAction(
        id,
        parsedEventId,
        page?.toString(),
        pageSize?.toString(),
      );

      res.status(200).json(transactions);
    } catch (error) {
      next(error);
    }
  };

  public getEventTicketCountController = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } = req.user as User;
      const { eventId } = req.params;
      const parsedEventId = Number(eventId);

      const ticketCount = await organizersAction.getEventTicketCountAction(
        id,
        parsedEventId,
      );

      res.status(200).json(ticketCount);
    } catch (error) {
      next(error);
    }
  };

  public getEventTicketController = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } = req.user as User;
      const { eventId } = req.params;
      const parsedEventId = Number(eventId);

      // get pagination parameters from the request query
      const { page, pageSize } = req.query;

      const tickets = await organizersAction.getEventTicketAction(
        id,
        parsedEventId,
        page?.toString(),
        pageSize?.toString(),
      );

      res.status(200).json(tickets);
    } catch (error) {
      next(error);
    }
  };

  public getEventRevenueController = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } = req.user as User;
      const { eventId } = req.params;
      const parsedEventId = Number(eventId);

      const totalRevenue = await organizersAction.getEventRevenueCountAction(
        id,
        parsedEventId,
      );

      res.status(200).json(totalRevenue);
    } catch (error) {
      next(error);
    }
  };

  public getEventPromotionCountController = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } = req.user as User;
      const { eventId } = req.params;
      const parsedEventId = Number(eventId);

      const promotionCount =
        await organizersAction.getEventPromotionCountAction(id, parsedEventId);

      res.status(200).json(promotionCount);
    } catch (error) {
      next(error);
    }
  };

  public getEventPromotionsController = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } = req.user as User;
      const { eventId } = req.params;
      const parsedEventId = Number(eventId);

      // get pagination parameters from the request query
      const { page, pageSize } = req.query;

      const promotions = await organizersAction.getEventPromotionsAction(
        id,
        parsedEventId,
        page?.toString(),
        pageSize?.toString(),
      );

      res.status(200).json(promotions);
    } catch (error) {
      next(error);
    }
  };

  public getEventReviewsController = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } = req.user as User;
      const { eventId } = req.params;
      const parsedEventId = Number(eventId);

      const reviews = await organizersAction.getEventReviewsAction(
        id,
        parsedEventId,
      );

      res.status(200).json(reviews);
    } catch (error) {
      next(error);
    }
  };
}
