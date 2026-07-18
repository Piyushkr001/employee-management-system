import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/api-error";
import { sendResponse } from "../utils/response";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = "Internal Server Error";

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err.name === "ZodError") {
    statusCode = 400;
    message = "Validation Error";
    // For Zod errors, we could include more details in `data`, but keeping it simple for now
  } else if (err.name === "UnauthorizedError") {
    statusCode = 401;
    message = "Unauthorized";
  }

  console.error(`[Error] ${statusCode} - ${message}\n`, err.stack);

  sendResponse(res, statusCode, message, process.env.NODE_ENV === "development" ? err.stack : undefined);
};
