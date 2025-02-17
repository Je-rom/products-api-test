import { Request } from 'express';
import { UserModel } from '../models/user.model';
import {
  comparePassword,
  generatePasswordResetToken,
  hashPassword,
} from '../utils/password';
import crypto from 'crypto';
import { AppError } from '../utils/appError';
import { CreateUserDto } from '../dtos/authDto/createUser.dto';
import { LoginUserDto } from '../dtos/authDto/loginUser.dto';
import { ForgotPasswordDto } from '../dtos/authDto/forgotPassword.dto';
import { ResetPasswordDto } from '../dtos/authDto/resetPassword.dto';
import { emailService } from '../service/email.service';

export class AuthService {
  public static async signUp(userData: CreateUserDto) {
    const existingUser = await UserModel.findOne({ email: userData.email });
    if (existingUser) {
      throw new AppError('User already exists with that email', 400);
    }

    userData.password = await hashPassword(userData.password);

    const newUser = await UserModel.create(userData);

    return newUser;
  }

  public static async signIn(loginData: LoginUserDto) {
    const ifUserExist = await UserModel.findOne({ email: loginData.email });
    if (!ifUserExist) {
      throw new AppError('User not found', 404);
    }
    const isPasswordCorrect = await comparePassword(
      loginData.password,
      ifUserExist.password,
    );
    if (!isPasswordCorrect) {
      throw new AppError(
        'Incorrect password, please try again with your correct password',
        404,
      );
    }
    return ifUserExist;
  }

  public static async forgotPassword(data: ForgotPasswordDto, req: Request) {
    const ifEmailExist = await UserModel.findOne({ email: data.email });
    if (!ifEmailExist) {
      throw new AppError('Email does not exist', 400);
    }

    const resetToken = await generatePasswordResetToken(ifEmailExist._id);

    //send reset token to the user
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/auth/reset-password/${resetToken}`;
    const message = `Forgot password? Make a request with your new password and confirm password to: ${resetURL}\nIf you didn't make this request, please ignore it.`;

    const emailResponse = await emailService.sendEmail(
      ifEmailExist.email,
      'Your password reset token (valid for 10 minutes)',
      message,
    );
    if (!emailResponse.success) {
      throw new AppError(
        'Failed to send reset email. Please try again later.',
        500,
      );
    }
    return { success: true };
  }

  public static async resetPassword(req: Request, data: ResetPasswordDto) {
    //retrieve the user by password reset token
    const userToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    //if user exists and if the token is valid
    const user = await UserModel.findOne({ passwordResetToken: userToken });
    if (!user) {
      throw new AppError(
        'The reset token is incorrect or not associated with any user.',
        400,
      );
    }

    //token has expired
    if (user.passwordResetExpires && user.passwordResetExpires < new Date()) {
      throw new AppError(
        'Reset token has expired, please request a new one',
        400,
      );
    }

    //hash the password
    const hashedPassword = await hashPassword(data.password);

    //update the user's password
    user.password = hashedPassword;
    user.passwordResetExpires = null;
    user.passwordResetToken = null;

    return await user.save();
  }
}
