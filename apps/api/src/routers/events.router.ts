import eventsController, { EventsController } from '@/controllers/events.controller';
import { Router } from 'express';

export class EventsRouter {
  private router: Router;
  private eventsController: EventsController;

  constructor() {
    this.eventsController = new EventsController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post('/create-event', this.eventsController.createEventController);
    this.router.get('/events', this.eventsController.getAllEventsController);
    this.router.get('/event?id', this.eventsController.getEventByIdController);
    this.router.patch('/update-event?id', this.eventsController.updateEventByIdController);
    this.router.delete('/delete-event?id', this.eventsController.deleteEventByIdController);
  }

  getRouter(): Router {
    return this.router;
  }
}

export default new EventsRouter().getRouter();
