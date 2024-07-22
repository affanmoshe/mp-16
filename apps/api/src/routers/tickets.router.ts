import { Router } from 'express';
import ticketController, { TicketController } from '@/controllers/ticket.controller';

export class TicketRouter {
  private router: Router;
  private ticketController: TicketController;

  constructor() {
    this.ticketController = new TicketController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post('/create-ticket', this.ticketController.createTicketController);
    this.router.get('/tickets', this.ticketController.getAllTicketsController);
    this.router.get('/event?id', this.ticketController.getTicketsByEventIdController);
    this.router.patch('/update-event?id', this.ticketController.updateTicketByIdController);
    this.router.delete('/delete-event?id', this.ticketController.deleteTicketByIdController);
  }

  getRouter(): Router {
    return this.router;
  }
}

export default new TicketRouter().getRouter();
