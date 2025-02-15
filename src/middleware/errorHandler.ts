import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/appError';
import {
  handleCastErrorDb,
  handleDuplicateFieldsDb,
  handleValidationErrorDb,
} from '../utils/mongoDbError';

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  console.error('Error:', err);

  let error = { ...err, name: err.name, message: err.message };

  if (error.name === 'CastError') error = handleCastErrorDb(error);
  if (error.code === 11000) error = handleDuplicateFieldsDb(error);
  if (error.name === 'ValidationError') error = handleValidationErrorDb(error);

  const statusCode = error instanceof AppError ? error.statusCode : 500;
  const status = error instanceof AppError ? error.status : 'error';
  const message =
    error instanceof AppError ? error.message : 'An unexpected error occurred';

  res.status(statusCode).json({
    statusCode,
    status,
    message,
    ...(process.env.NODE_ENV === 'development' && {
      stack: error.stack?.split('\n'),
    }),
  });
};
