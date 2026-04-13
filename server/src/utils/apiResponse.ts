import { Response } from "express";

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
}

export function success<T>(
  res: Response,
  data: T,
  statusCode: number = 200
): Response<ApiResponse<T>> {
  return res.status(statusCode).json({
    success: true,
    data,
  });
}

export function created<T>(res: Response, data: T): Response<ApiResponse<T>> {
  return res.status(201).json({
    success: true,
    data,
  });
}

export function error(
  res: Response,
  message: string,
  statusCode: number = 400
): Response<ApiResponse> {
  return res.status(statusCode).json({
    success: false,
    message,
  });
}

export function unauthorized(res: Response, message: string = "Unauthorized"): Response<ApiResponse> {
  return error(res, message, 401);
}

export function forbidden(res: Response, message: string = "Forbidden"): Response<ApiResponse> {
  return error(res, message, 403);
}

export function notFound(res: Response, message: string = "Resource not found"): Response<ApiResponse> {
  return error(res, message, 404);
}

export function badRequest(res: Response, message: string = "Bad Request"): Response<ApiResponse> {
  return error(res, message, 400);
}

export function internalError(res: Response, message: string = "Internal Server Error"): Response<ApiResponse> {
  return error(res, message, 500);
}