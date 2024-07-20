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
import { FRONTEND_URL, PORT } from './config';
import { AuthRouter } from './routers/auth.router';
import { UsersRouter } from './routers/users.router';
import { PasswordRouter } from './routers/password.router';
import { OrganizersRouter } from './routers/organizers.router';
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
  }

  private handleError(): void {
    // not found
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      if (req.path.includes('/api/')) {
        res.status(404).send('Not found !');
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
    // const sampleRouter = new SampleRouter();
    const authRouter = new AuthRouter();
    const usersRouter = new UsersRouter();
    const passwordRouter = new PasswordRouter();
    const organizersRouter = new OrganizersRouter();

    this.app.get('/api', (req: Request, res: Response) => {
      res.send(`Hello, Purwadhika Student API!`);
    });

    // this.app.use('/api/samples', sampleRouter.getRouter());

    this.app.use('/api/auth', authRouter.getRouter());
    this.app.use('/api/users', usersRouter.getRouter());
    this.app.use('/api/password', passwordRouter.getRouter());
    this.app.use('/api/organizers', organizersRouter.getRouter());
  }

  public start(): void {
    this.app.listen(PORT, () => {
      console.log(`  ➜  [API] Local:   http://localhost:${PORT}/`);
    });
  }
}
