import { NextFunction, Request, Response } from 'express';
import eventAction from '../actions/events.action';

export class EventsController {
  private errorHandler(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }

  public createEventController = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const {
        organizerId,
        name,
        description,
        location,
        dateTime,
        ticketType,
        price,
        availableSeats,
        status,
      } = req.body;

      const event = await eventAction.createEvent(
        organizerId,
        name,
        description,
        location,
        new Date(dateTime),
        ticketType,
        price,
        availableSeats,
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
    next: NextFunction
  ) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 10;
      const searchQuery = req.query.search as string;
      const filterBy = {
        location: req.query.location as string,
        category: req.query.category as string,
      };

      const { events, totalCount } = await eventAction.getAllEvents(page, pageSize, searchQuery, filterBy);
      res.status(200).json({ events, totalCount });
    } catch (error) {
      next(error);
    }
  };

  public getEventByIdController = async (
    req: Request,
    res: Response,
    next: NextFunction
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
    next: NextFunction
  ) => {
    try {
      const eventId = parseInt(req.params.id);
      const {
        name,
        description,
        location,
        dateTime,
        ticketType,
        price,
        availableSeats,
        promotion,
      } = req.body;
      
      const updatedEvent = await eventAction.updateEventById(
        eventId,
        name,
        description,
        location,
        new Date(dateTime),
        ticketType,
        price,
        availableSeats,
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
    next: NextFunction
  ) => {
    try {
      const eventId = parseInt(req.params.id);
      const deletedEvent = await eventAction.deleteEventById(eventId);
      res.status(200).json({
        message: 'Event deleted successfully',
        data: deletedEvent,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new EventsController();