import type { Response } from "express";

export function successResponse(
  res: Response,
  data: unknown,
  statusCode = 200,
) {
  return res.status(statusCode).json({
    success: true,
    data,
  });
}

export function failResponse(res: Response, message: string, statusCode = 400) {
  return res.status(statusCode).json({
    success: false,
    message,
  });
}
