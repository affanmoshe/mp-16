import { NextFunction, Request, Response } from 'express';
import eventAction from '../actions/events.action';
import { User } from '@/types/express';

export class EventsController {
  private errorHandler(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }

  public createEventController = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } = req.user as User;
      const {
        name,
        description,
        location,
        dateTime,
        ticketType,
        price,
        availableSeats,
        status,
      } = req.body;
      const { file } = req;

      const event = await eventAction.createEvent(
        id,
        file?.filename,
        name,
        description,
        location,
        dateTime,
        ticketType,
        Number(price),
        Number(availableSeats),
        status,
      );

      res.status(201).json({
        message: 'Event created successfully',
        data: event,
      });
    } catch (error) {
      next(error);
    }
  };

  public getAllEventsController = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const events = await eventAction.getAllEvents();
      res.status(200).json(events);
    } catch (error) {
      next(error);
    }
  };

  public getEventByIdController = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const eventId = parseInt(req.params.id);
      const event = await eventAction.getEventById(eventId);
      res.status(200).json(event);
    } catch (error) {
      next(error);
    }
  };

  public updateEventByIdController = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } = req.user as User;
      const { eventId } = req.params;
      const parsedEventId = parseInt(eventId);

      const {
        name,
        description,
        location,
        dateTime,
        ticketType,
        price,
        availableSeats,
        status,
      } = req.body;
      const { file } = req;

      const updatedEvent = await eventAction.updateEventById(
        id,
        parsedEventId,
        file?.filename,
        name,
        description,
        location,
        dateTime,
        ticketType,
        Number(price),
        Number(availableSeats),
        status,
      );

      res.status(200).json({
        message: 'Event updated successfully',
        data: updatedEvent,
      });
    } catch (error) {
      next(error);
    }
  };

  public deleteEventByIdController = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } = req.user as User;
      const { eventId } = req.params;
      const parsedEventId = parseInt(eventId);

      await eventAction.deleteEventById(id, parsedEventId);

      res.status(200).json({
        message: 'Event deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  };
}

export default new EventsController();
