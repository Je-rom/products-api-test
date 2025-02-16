import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/appError';
import {
  handleCastErrorDb,
  handleDuplicateFieldsDb,
  handleValidationErrorDb,
} from '../utils/mongoDbError';

export const globalErrorHandler = (
  err: AppError | Error,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  console.error('Error:', err);

  let error: AppError;

  if (err instanceof AppError) {
    // If the error is already an instance of AppError, use it directly
    error = err;
  } else {
    // else, check for mongoDB specific errors and wrap them into AppError
    if ((err as any).name === 'CastError') {
      error = handleCastErrorDb(err);
    } else if ((err as any).code === 11000) {
      error = handleDuplicateFieldsDb(err);
    } else if ((err as any).name === 'ValidationError') {
      error = handleValidationErrorDb(err);
    } else {
      // If its not a known error, wrap it in a generic AppError
      error = new AppError(err.message || 'An unexpected error occurred', 500);
    }
  }

  res.status(error.statusCode).json({
    statusCode: error.statusCode,
    status: error.status,
    message: error.message,
    ...(process.env.NODE_ENV === 'development' && {
      stack: error.stack?.split('\n'),
    }),
  });
};
