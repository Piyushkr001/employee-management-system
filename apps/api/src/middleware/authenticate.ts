import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/api-error";
import { verifyAccessToken } from "../utils/jwt";
import db from "../db";
import { env } from "../config/env";
import { eq } from "drizzle-orm";
import { employees } from "../db/schema/employees";
import { AuthenticatedUserDto } from "@empnexa/shared";

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUserDto;
    }
  }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies[env.COOKIE_NAME];
    
    if (!token) {
      return next(new ApiError(401, "Not authenticated"));
    }

    const payload = verifyAccessToken(token);
    
    const user = await db.query.employees.findFirst({
      where: (emps, { eq }) => eq(emps.id, payload.sub),
    });

    if (!user) {
      return next(new ApiError(401, "User not found"));
    }

    if (user.status !== "active") {
      return next(new ApiError(401, "Account is inactive"));
    }

    if (user.deletedAt !== null) {
      return next(new ApiError(401, "Account has been deleted"));
    }

    // Attach sanitized user data
    req.user = {
      id: user.id,
      employeeCode: user.employeeCode,
      name: user.name,
      email: user.email,
      phone: user.phone,
      department: user.department,
      designation: user.designation,
      joiningDate: typeof user.joiningDate === "string" 
        ? user.joiningDate 
        : (user.joiningDate as Date).toISOString().split("T")[0],
      status: user.status as any,
      role: user.role as any,
      managerId: user.managerId,
      profileImageUrl: user.profileImageUrl,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };

    next();
  } catch (error) {
    next(new ApiError(401, "Invalid or expired token"));
  }
};
