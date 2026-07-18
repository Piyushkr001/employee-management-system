import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/api-error";
import { UserRole } from "@empnexa/shared";

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: UserRole;
        [key: string]: any;
      };
    }
  }
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  // TODO: Implement JWT verification logic
  // For now, it passes or fails based on a placeholder
  // const token = req.cookies.empnexa_token;
  // if (!token) throw new ApiError(401, "Not authenticated");
  
  // placeholder passing logic for foundation setup
  req.user = { id: "placeholder-id", role: "employee" };
  next();
};
