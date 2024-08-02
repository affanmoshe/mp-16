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
import { join } from 'path';
import path = require('path');

import { FRONTEND_URL, PORT } from './config';
import { EventsRouter } from './routers/events.router';
import { ReviewRouter } from './routers/reviews.router';
import { TicketRouter } from './routers/tickets.router';
import { TransactionRouter } from './routers/transactions.router';
import { PromotionRouter } from './routers/promotions.router';
import { AuthRouter } from './routers/auth.router';
import { UsersRouter } from './routers/users.router';
import { PasswordRouter } from './routers/password.router';
import { OrganizersRouter } from './routers/organizers.router';
import { PointsRouter } from './routers/points.router';
import { DiscountsRouter } from './routers/discounts.router';
// import { SampleRouter } from './routers/sample.router';

export default class App {
  private app: Express;

  constructor() {
    this.app = express();
    this.configure();
    this.routes();
    this.handleError();
  }

  private configure(): void {
    this.app.use(
      cors({
        origin: FRONTEND_URL,
        credentials: true,
      }),
    );
    this.app.use(json());
    this.app.use(urlencoded({ extended: true }));
    this.app.use(express.static('public'));
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
          console.error('Error : ', err.stack);
          res.status(500).send(err.message);
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
    const authRouter = new AuthRouter();
    const usersRouter = new UsersRouter();
    const passwordRouter = new PasswordRouter();
    const pointsRouter = new PointsRouter();
    const discountsRouter = new DiscountsRouter();
    const organizersRouter = new OrganizersRouter();

    this.app.get('/api', (req: Request, res: Response) => {
      res.send(`Hello, Purwadhika Student API!`);
    });

    this.app.get('/avatar/:name', (req: Request, res: Response) => {
      const imageName = req.params.name;
      res.sendFile(path.join(__dirname, 'public/avatar', imageName));
    });

    this.app.get('/thumbnail/:name', (req: Request, res: Response) => {
      const imageName = req.params.name;
      res.sendFile(path.join(__dirname, 'public/thumbnail', imageName));
    });

    this.app.use('/api/events', eventsRouter.getRouter());
    this.app.use('/api/reviews', reviewsRouter.getRouter());
    this.app.use('/api/tickets', ticketsRouter.getRouter());
    this.app.use('/api/transactions', transactionsRouter.getRouter());
    this.app.use('/api/promotions', promotionsRouter.getRouter());
    this.app.use('/api/auth', authRouter.getRouter());
    this.app.use('/api/users', usersRouter.getRouter());
    this.app.use('/api/password', passwordRouter.getRouter());
    this.app.use('/api/points', pointsRouter.getRouter());
    this.app.use('/api/discounts', discountsRouter.getRouter());
    this.app.use('/api/organizers', organizersRouter.getRouter());
  }

  public start(): void {
    this.app.listen(PORT, () => {
      console.log(`  ➜  [API] Local:   http://localhost:${PORT}/`);
    });
  }
}
