import { EventStatus, TicketType } from '@prisma/client';
import prisma from '../prisma';

class EventAction {
  public async createEvent(
    organizerId: number,
    name: string,
    description: string | null,
    location: string,
    dateTime: Date,
    ticketType: TicketType,
    price: number,
    availableSeats: number,
    status: EventStatus
  ) {
    try {
      const event = await prisma.event.create({
        data: {
          organizerId,
          name,
          description,
          location,
          dateTime,
          ticketType,
          price,
          availableSeats,
          status,
        }
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
    id: number,
    name: string,
    description: string | null,
    location: string,
    dateTime: Date,
    ticketType: TicketType,
    price: number,
    availableSeats: number,
  ) {
    try {
      const event = await prisma.event.update({
        where: {
          id,
        },
        data: {
          name,
          description,
          location,
          dateTime,
          ticketType,
          price,
          availableSeats,
        },
      });
      return event;
    } catch (error) {
      throw error;
    }
  }
  
  public async deleteEventById(id: number) {
    try {
      const event = await prisma.event.delete({
        where: {
          id,
        },
      });
      return event;
    } catch (error) {
      throw error;
    }
  }
}

export default new EventAction();