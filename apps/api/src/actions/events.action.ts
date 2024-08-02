import { EventStatus, TicketType } from '@prisma/client';
import prisma from '../prisma';
import usersAction from './users.action';

class EventAction {
  public async createEvent(
    organizerId: number,
    thumbnail: string = '',
    name: string,
    description: string = '',
    location: string,
    dateTime: Date,
    ticketType: TicketType,
    price: number,
    availableSeats: number,
    status: EventStatus,
  ) {
    try {
      const event = await prisma.event.create({
        data: {
          organizerId,
          thumbnail,
          name,
          description,
          location,
          dateTime,
          ticketType,
          price,
          availableSeats,
          status,
        },
      });
      return event;
    } catch (error) {
      throw error;
    }
  }

  public async getAllEvents(page: number, pageSize: number, searchQuery?: string, filterBy?: { location?: string; category?: string }) {
    try {
      const filters: any = {};

      // Search by name
      if (searchQuery) {
        filters.name = {
          contains: searchQuery,
        };
      }

      // Filter by location
      if (filterBy?.location) {
        filters.location = {
          contains: filterBy.location,
        };
      }

      // Filter by category
      if (filterBy?.category) {
        filters.category = {
          equals: filterBy.category,
        };
      }

      // Fetch events with pagination
      const events = await prisma.event.findMany({
        where: filters,
        skip: (page - 1) * pageSize,
        take: pageSize,
      });

      // Count total events for pagination
      const totalCount = await prisma.event.count({ where: filters });

      return { events, totalCount };
    } catch (error) {
      throw error;
    }
  }

  public async getEventById(id: number) {
    try {
      const event = await prisma.event.findUnique({
        where: {
          id,
        },
      });
      if (!event) throw new Error('Event not found');
      return event;
    } catch (error) {
      throw error;
    }
  }

  public async updateEventById(
    organizerId: number,
    eventId: number,
    thumbnail: string = '',
    name: string,
    description: string = '',
    location: string,
    dateTime: Date,
    ticketType: TicketType,
    price: number,
    availableSeats: number,
    status: EventStatus,
  ) {
    try {
      // check if the user id is valid
      const check = await usersAction.findSelfById(organizerId);
      if (!check) throw new Error('User not found');

      let content = {};

      if (thumbnail !== undefined) content = { ...content, thumbnail };
      if (name) content = { ...content, name };
      if (description !== undefined) content = { ...content, description };
      if (location) content = { ...content, location };
      if (dateTime) content = { ...content, dateTime };
      if (ticketType) content = { ...content, ticketType };
      if (price) content = { ...content, price };
      if (availableSeats) content = { ...content, availableSeats };
      if (status) content = { ...content, status };

      const event = await prisma.event.update({
        where: {
          id: eventId,
          organizerId,
        },
        data: {
          ...content,
        },
      });

      return event;
    } catch (error) {
      throw error;
    }
  }

  public async deleteEventById(organizerId: number, eventId: number) {
    try {
      await prisma.event.delete({
        where: {
          id: eventId,
          organizerId,
        },
      });
    } catch (error) {
      throw error;
    }
  }
}

export default new EventAction();