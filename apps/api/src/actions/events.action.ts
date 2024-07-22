import prisma from '../prisma';

class EventAction {
  public async createEvent(
    organizerId: number,
    name: string,
    description: string | null,
    location: string,
    date: Date,
    time: Date,
    ticketType: string,
    price: number,
    availableSeats: number,
    promotion: number | null
  ) {
    try {
      const event = await prisma.event.create({
        data: {
          organizerId,
          name,
          description,
          location,
          date,
          time,
          ticketType,
          price,
          availableSeats,
          promotion,
        },
      });
      return event;
    } catch (error) {
      throw error;
    }
  }

  public async getAllEvents() {
    try {
      const events = await prisma.event.findMany();
      return events;
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
    date: Date,
    time: Date,
    ticketType: string,
    price: number,
    availableSeats: number,
    promotion: number | null
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
          date,
          time,
          ticketType,
          price,
          availableSeats,
          promotion,
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
