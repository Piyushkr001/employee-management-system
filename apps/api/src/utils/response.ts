import { Response } from "express";
import { ApiResponse } from "@empnexa/shared";

export function sendResponse<T>(
  res: Response,
  statusCode: number,
  message: string,
  data?: T,
  errorPayload?: ApiResponse<T>["error"]
) {
  const isSuccess = statusCode >= 200 && statusCode < 300;
  const response: ApiResponse<T> = {
    success: isSuccess,
    message,
  };
  
  if (isSuccess && data !== undefined) {
    response.data = data;
  }
  
  if (!isSuccess && errorPayload) {
    response.error = errorPayload;
  }

  return res.status(statusCode).json(response);
}
