import { AppError } from './appError';

//castError (invalid mongoDB bjectId)
export const handleCastErrorDb = (err: any): AppError => {
  const message = `Invalid ${err.path}, please pass in a valid id`;
  return new AppError(message, 400);
};

//duplicate key error
export const handleDuplicateFieldsDb = (err: any): AppError => {
  const value = err.keyValue
    ? Object.values(err.keyValue).join(', ')
    : 'Unknown value';
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

//validation errors
export const handleValidationErrorDb = (err: any): AppError => {
  const errors = Object.values(err.errors).map((el: any) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};
