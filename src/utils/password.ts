import * as bcrypt from 'bcrypt';
import crypto from 'crypto';
import { UserModel } from '../models/user.model';
import { IUser } from '../types/user.types';

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (
  enteredPassword: string,
  hashedPassword: string,
): Promise<boolean> => {
  return await bcrypt.compare(enteredPassword, hashedPassword);
};

export const changedPasswordAfter = async (
  userId: IUser,
  JWTTimestamp: number,
): Promise<boolean> => {
  const user = await UserModel.findById(userId).select('+passwordChangedAt');
  if (!user || !user.passwordChangedAt) return false;

  const passwordChangedTime = new Date(user.passwordChangedAt).getTime() / 1000;
  return JWTTimestamp < passwordChangedTime;
};

export const generatePasswordResetToken = async (
  userId: string,
): Promise<string> => {
  const resetToken = crypto.randomBytes(32).toString('hex');
  const hashedResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  await UserModel.findByIdAndUpdate(userId, {
    passwordResetToken: hashedResetToken,
    passwordResetExpires: Date.now() + 10 * 60 * 1000,
  });

  return resetToken;
};
