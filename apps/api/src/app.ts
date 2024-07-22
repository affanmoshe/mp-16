import express, {
  json,
  urlencoded,
  Express,
  Request,
  Response,
  NextFunction,
  Router,
} from 'express';
import cors from 'cors';
import { PORT } from './config';
import { EventsRouter } from './routers/events.router';
import { ReviewRouter } from './routers/reviews.router';
import { TicketRouter } from './routers/tickets.router';
import { TransactionRouter } from './routers/transactions.router';
import { PromotionRouter } from './routers/promotions.router';

export default class App {
  private app: Express;

  constructor() {
    this.app = express();
    this.configure();
    this.routes();
    this.handleError();
  }

  private configure(): void {
    this.app.use(cors());
    this.app.use(json());
    this.app.use(urlencoded({ extended: true }));
  }

  private handleError(): void {
    // not found
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      if (req.path.includes('/api/')) {
        res.status(404).send('Not founds!');
      } else {
        next();
      }
    });

    // error
    this.app.use(
      (err: Error, req: Request, res: Response, next: NextFunction) => {
        if (req.path.includes('/api/')) {
          console.error('Error: ', err.stack);
          res.status(500).send('Error!');
        } else {
          next();
        }
      },
    );
  }

  private routes(): void {
    const eventsRouter = new EventsRouter();
    const reviewsRouter = new ReviewRouter();
    const ticketsRouter = new TicketRouter();
    const transactionsRouter = new TransactionRouter();
    const promotionsRouter = new PromotionRouter();

    this.app.get('/api', (req: Request, res: Response) => {
      res.send(`Hello, Purwadhika Student API!`);
    });

    this.app.use('/api/events', eventsRouter.getRouter());
    this.app.use('/api/reviews', reviewsRouter.getRouter());
    this.app.use('/api/tickets', ticketsRouter.getRouter());
    this.app.use('/api/transactions', transactionsRouter.getRouter());
    this.app.use('/api/promotions', promotionsRouter.getRouter());
  }

  public start(): void {
    this.app.listen(PORT, () => {
      console.log(`  ➜  [API] Local:   http://localhost:${PORT}/`);
    });
  }
}
