export type User = {
  id: number;
  email: string;
  username: string;
  role: string;
  avatar?: string;
  isVerified: boolean;
};

declare global {
  namespace Express {
    export interface Request {
      user?: User;
    }
  }
}
