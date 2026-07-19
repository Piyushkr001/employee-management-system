import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/api-error";
import { sendResponse } from "../utils/response";
import { ZodError } from "zod";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = "Internal Server Error";
  let code: string | undefined;
  let fieldErrors: Record<string, string[]> | undefined;

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    code = err.code;
    fieldErrors = err.fieldErrors;
  } else if (err instanceof ZodError || err.name === "ZodError") {
    statusCode = 400;
    message = "Validation Error";
    code = "VALIDATION_ERROR";
    if (err instanceof ZodError) {
      fieldErrors = err.flatten().fieldErrors as Record<string, string[]>;
    }
  } else if (err.name === "UnauthorizedError") {
    statusCode = 401;
    message = "Unauthorized";
    code = "UNAUTHORIZED";
  }

  // Only log unexpected server errors with full stack trace, avoiding sending stack trace to client
  if (statusCode === 500) {
    console.error(`[Error] 500 - ${err.message}\n`, err.stack);
  } else {
    console.error(`[Error] ${statusCode} - ${message}`);
  }

  sendResponse(res, statusCode, message, undefined, {
    code,
    ...(fieldErrors ? { fieldErrors } : {}),
  });
};
