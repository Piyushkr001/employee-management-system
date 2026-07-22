import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/api-error";
import { verifyAccessToken } from "../utils/jwt";
import { env } from "../config/env";
import { AuthRepository } from "../modules/auth/auth.repository";
import { AuthenticatedUserDto, UserRole, EmployeeStatus } from "@empnexa/shared";
import { toAuthenticatedUserDto, EmployeeAuthProfileRecord } from "../modules/auth/auth.mapper";

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUserDto;
    }
  }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies[env.COOKIE_NAME];
  
  if (!token) {
    return next(new ApiError(401, "Not authenticated", "UNAUTHENTICATED"));
  }

  let payload;
  try {
    payload = verifyAccessToken(token);
  } catch (error) {
    return next(new ApiError(401, "Invalid or expired token", "INVALID_TOKEN"));
  }

  try {
    const authRepository = new AuthRepository();
    const user = await authRepository.findFullEmployeeById(payload.sub);

    if (!user || user.deletedAt) {
      return next(new ApiError(401, "Authentication session is invalid", "INVALID_SESSION"));
    }

    if (user.status !== "active") {
      return next(new ApiError(403, "Employee account is inactive", "ACCOUNT_INACTIVE"));
    }

    req.user = toAuthenticatedUserDto(user as EmployeeAuthProfileRecord);

    next();
  } catch (error) {
    // If DB fails, let it fall through to global error handler (500)
    next(error);
  }
};
