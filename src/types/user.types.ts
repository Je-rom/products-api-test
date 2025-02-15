export enum UserRole {
  REGULAR_USER = 'REGULAR_USER',
  VENDOR = 'VENDOR',
}

export interface IUser {
  _id: string;
  first_name: string;
  second_name: string;
  email: string;
  role: UserRole;
  password: string;
  passwordChangedAt?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  active: boolean;
  correctPassword(candidatePassword: string): Promise<boolean>;
  createdAt: Date;
  updatedAt: Date;
}
