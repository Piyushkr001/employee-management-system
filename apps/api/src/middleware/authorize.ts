import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/api-error";
import { UserRole } from "@empnexa/shared";

export const authorize = (...allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.role) {
      return next(new ApiError(401, "Not authenticated"));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new ApiError(403, "Not authorized to access this resource"));
    }

    next();
  };
};
