import eventsController, {
  EventsController,
} from '@/controllers/events.controller';
import { uploader } from '@/libs/uploader';
import { AuthMiddleware } from '@/middlewares/auth.middleware';
import { Router } from 'express';

export class EventsRouter {
  private router: Router;
  private eventsController: EventsController;
  private guard: AuthMiddleware;

  constructor() {
    this.eventsController = new EventsController();
    this.guard = new AuthMiddleware();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      '/create',
      this.guard.verifyAccessToken,
      this.guard.verifyRole('ORGANIZER'),
      uploader('thumbnail', '/thumbnail').single('file'),
      this.eventsController.createEventController,
    );

    this.router.get('/', this.eventsController.getAllEventsController);
    this.router.get('/:id', this.eventsController.getEventByIdController);

    this.router.patch(
      '/update/:eventId',
      this.guard.verifyAccessToken,
      this.guard.verifyRole('ORGANIZER'),
      uploader('thumbnail', '/thumbnail').single('file'),
      this.eventsController.updateEventByIdController,
    );
    this.router.delete(
      '/delete/:eventId',
      this.guard.verifyAccessToken,
      this.guard.verifyRole('ORGANIZER'),
      this.eventsController.deleteEventByIdController,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}

export default new EventsRouter().getRouter();