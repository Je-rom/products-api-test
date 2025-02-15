import { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/appError';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { UserRole } from '../types/user.types';
import { UserModel } from '../models/user.model';
import { changedPasswordAfter } from '../utils/password';

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in the environment variables.');
}
const secret = process.env.JWT_SECRET as string;

export const JwtAuthGuard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You are not logged in, please login', 401));
  }

  try {
    //verify token
    const verifyToken = jwt.verify(token, secret) as JwtPayload;

    const userWithToken = await UserModel.findOne({ id: verifyToken.id });
    if (!userWithToken) {
      return next(
        new AppError('The user belonging to this token, no longer exists', 401),
      );
    }
    if (!verifyToken.iat) {
      return next(
        new AppError('Invalid token: missing issued-at timestamp', 401),
      );
    }

    if (await changedPasswordAfter(userWithToken, verifyToken.iat)) {
      return next(
        new AppError(
          'User recently changed password! Please log in again.',
          401,
        ),
      );
    }

    req.user = userWithToken;
    console.log('user object:', userWithToken);
    next();
  } catch (error) {
    return next(new AppError('Invalid token. Please log in again', 401));
  }
};

export const RoleGuard = (requiredRoles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userRole = req.user?.role;
      console.log('role:', userRole);
      if (!userRole || !requiredRoles.includes(userRole)) {
        throw new AppError(
          'You do not have the required permissions to access this resource.',
          403,
        );
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};
