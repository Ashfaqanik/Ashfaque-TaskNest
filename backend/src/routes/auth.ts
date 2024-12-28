import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;
        username: string;
      };
    }
  }
}

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res
      .status(401)
      .json({ message: "Unauthorized: Token missing or invalid." });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    jwt.verify(token, process.env.JWT_SECRET || "my_task_nest", (err, user) => {
      if (err) {
        return res
          .status(403)
          .json({ message: "Token expired. Please sign in again." });
      }
      req.user = user as { userId: number; username: string };
      next();
    });
  } catch (error) {
    res.status(403).json({ message: "Forbidden: Invalid or expired token." });
  }
};
