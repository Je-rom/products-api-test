import { NextFunction, Request, Response } from 'express';
import { createToken } from '../utils/auth';
import { AuthService } from '../service/auth.service';
import { plainToInstance } from 'class-transformer';
import { validateEntity } from '../utils/validation';
import { ResetPasswordDto } from '../dtos/resetPassword.dto';
import { LoginUserDto } from '../dtos/loginUser.dto';
import { CreateUserDto } from '../dtos/createUser.dto';
import { ForgotPasswordDto } from '../dtos/forgotPassword.dto';

class AuthController {
  public signUp = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const registerDto = plainToInstance(CreateUserDto, req.body);
      await validateEntity(registerDto);
      const newUser = await AuthService.signUp(registerDto);
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
      const loginDto = plainToInstance(LoginUserDto, req.body);
      await validateEntity(loginDto);
      const loginUser = await AuthService.signIn(loginDto);
      createToken(loginUser, 200, res, 'Login successful');
    } catch (error) {
      next(error);
    }
  };

  public forgotPassword = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const forgotPasswordDto = plainToInstance(ForgotPasswordDto, req.body);
      await validateEntity(forgotPasswordDto);
      const response = await AuthService.forgotPassword(forgotPasswordDto, req);

      if (!response.success) {
        res.status(500).json({
          status: 'error',
          message:
            'Failed to send password reset email. Please try again later.',
        });
        return;
      }

      res.status(200).json({
        status: 'success',
        message: 'Token sent to your email!',
      });
    } catch (error) {
      next(error);
    }
  };

  public resetPassword = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const resetPasswordDto = plainToInstance(ResetPasswordDto, req.body);
      await validateEntity(resetPasswordDto);
      await AuthService.resetPassword(req, resetPasswordDto);
      res.status(200).json({
        message:
          'Your password has been reset successfully. Please log in again.',
      });
    } catch (error) {
      next(error);
    }
  };
}

export const authController = new AuthController();
