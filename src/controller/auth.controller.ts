import { NextFunction, Request, Response } from 'express';
import { createToken } from '../utils/auth';
import { AuthService } from '../service/auth.service';

class AuthController {
  public signUp = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const newUser = await AuthService.signUp(req.body);
      createToken(newUser, 201, res, 'Registered successfully');
    } catch (error) {
      next(error);
    }
  };

  public signIn = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const loginUser = await AuthService.signIn(req.body);
      createToken(loginUser, 200, res, 'Login successful');
    } catch (error) {
      next(error);
    }
  };
}

export const authController = new AuthController();
