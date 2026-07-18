import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/api-error";
import { verifyAccessToken } from "../utils/jwt";
import { env } from "../config/env";
import { AuthRepository } from "../modules/auth/auth.repository";
import { UserRole, EmployeeStatus } from "@empnexa/shared";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        employeeCode: string;
        name: string;
        email: string;
        role: UserRole;
        status: EmployeeStatus;
      };
    }
  }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies[env.COOKIE_NAME];
  
  if (!token) {
    return next(new ApiError(401, "Not authenticated"));
  }

  let payload;
  try {
    payload = verifyAccessToken(token);
  } catch (error) {
    return next(new ApiError(401, "Invalid or expired token"));
  }

  try {
    const authRepository = new AuthRepository();
    const user = await authRepository.findEmployeeIdentityById(payload.sub);

    if (!user || user.deletedAt) {
      return next(new ApiError(401, "Authentication session is invalid"));
    }

    if (user.status !== "active") {
      return next(new ApiError(403, "Employee account is inactive"));
    }

    req.user = {
      id: user.id,
      employeeCode: user.employeeCode,
      name: user.name,
      email: user.email,
      role: user.role as UserRole,
      status: user.status as EmployeeStatus,
    };

    next();
  } catch (error) {
    // If DB fails, let it fall through to global error handler (500)
    next(error);
  }
};
