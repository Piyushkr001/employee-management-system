import { Response } from "express";

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
};

export function sendResponse<T>(
  res: Response,
  statusCode: number,
  message: string,
  data?: T
) {
  const response: ApiResponse<T> = {
    success: statusCode >= 200 && statusCode < 300,
    message,
    ...(data !== undefined && { data }),
  };

  return res.status(statusCode).json(response);
}
