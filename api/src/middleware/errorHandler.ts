import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../utils/AppError';

export interface ErrorResponse {
  success: false;
  error: {
    message: string;
    details?: unknown;
  };
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    const body: ErrorResponse = {
      success: false,
      error: {
        message: err.message,
        ...(err.details !== undefined ? { details: err.details } : {}),
      },
    };
    res.status(err.statusCode).json(body);
    return;
  }

  if (err instanceof ZodError) {
    const body: ErrorResponse = {
      success: false,
      error: {
        message: 'Validation failed',
        details: err.flatten(),
      },
    };
    res.status(400).json(body);
    return;
  }

  console.error(err);
  const body: ErrorResponse = {
    success: false,
    error: { message: 'Internal server error' },
  };
  res.status(500).json(body);
}
