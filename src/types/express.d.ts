import { Request } from 'express';
import { UserModel } from '../models/user.model';

declare global {
  namespace Express {
    interface Request {
      user?: UserModel;
      requestTime?: string;
    }
  }
}
