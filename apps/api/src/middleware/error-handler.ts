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
    statusCode = 422;
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

  // Logging Policy
  if (statusCode === 500) {
    console.error(`[Error] 500 - ${err.message}\n`, err.stack);
  } else if (statusCode === 401 || statusCode === 403) {
    console.warn(`[Security] ${statusCode} - ${message} [Code: ${code}]`);
  } else if (statusCode !== 404 && statusCode !== 422) {
    // Other 4xx except 404 and 422 validations (like 409 conflict) could just not be logged at error, or optionally info. 
    // "Expected validation errors -> no error-level log"
    // "Not-found errors -> no error-level log"
    // "Database/network failures -> error-level log" (which are 500s or unhandled)
  }

  const errorPayload: any = {};
  if (code) errorPayload.code = code;
  if (fieldErrors) errorPayload.fieldErrors = fieldErrors;

  sendResponse(res, statusCode, message, undefined, Object.keys(errorPayload).length > 0 ? errorPayload : undefined);
};
