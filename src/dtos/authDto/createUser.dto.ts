import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  MinLength,
} from 'class-validator';
import { UserRole } from '../../types/user.types';

export class CreateUserDto {
  @IsNotEmpty({ message: 'First name is required' })
  first_name!: string;

  @IsNotEmpty({ message: 'Second name is required' })
  second_name!: string;

  @IsEmail({}, { message: 'Invalid email format' })
  email!: string;

  @IsEnum(UserRole, { message: 'Role must be either REGULAR_USER or VENDOR' })
  @IsOptional()
  role?: UserRole;

  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password!: string;
}
