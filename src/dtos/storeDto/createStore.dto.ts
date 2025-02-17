import { IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';

export class CreateStoreDto {
  @IsNotEmpty({ message: 'Store name is required' })
  @IsString({ message: 'Store name must be a string' })
  @MinLength(3, { message: 'Store name must be at least 3 characters long' })
  @MaxLength(50, { message: 'Store name cannot be more than 50 characters' })
  name!: string;

  @IsNotEmpty({ message: 'Description is required' })
  @IsString({ message: 'Description must be a string' })
  @MinLength(10, { message: 'Description must be at least 10 characters long' })
  @MaxLength(200, { message: 'Description cannot exceed 200 characters' })
  description!: string;
}
