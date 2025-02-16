import mongoose, { Schema, Model } from 'mongoose';
import validator from 'validator';
import { UserRole, IUser } from '../types/user.types';

const userSchema = new Schema<IUser>(
  {
    first_name: {
      type: String,
      required: [true, 'Please input your first name'],
      minlength: [3, 'Name cannot be less than 3 characters'],
      maxlength: [50, 'Name cannot be more than 50 characters'],
    },
    second_name: {
      type: String,
      required: [true, 'Please input your second name'],
      minlength: [3, 'Name cannot be less than 3 characters'],
      maxlength: [50, 'Name cannot be more than 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please input your email address'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please input a valid email'],
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.REGULAR_USER,
    },
    password: {
      type: String,
      required: [true, 'Please input your password'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: true,
    },
    passwordChangedAt: { type: Date },
    passwordResetToken: { type: String, default: null },
    passwordResetExpires: { type: Date, default: null },
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  { timestamps: true },
);

export const UserModel: Model<IUser> = mongoose.model<IUser>(
  'User',
  userSchema,
);
