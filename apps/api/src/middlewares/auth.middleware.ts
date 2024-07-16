import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import { User } from "../types/express";
import { API_KEY } from "../config";

export class AuthMiddleware {
  verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.header("Authorization")?.replace("Bearer ", "");

      if (!token) throw new Error("Token is missing");

      const isToken = verify(token, String(API_KEY));

      if (!isToken) throw new Error("Unauthorized");

      req.user = isToken as User;

      next();
    } catch (error) {
      next(error);
    }
  };
}
