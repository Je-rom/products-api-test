import { IsOptional, IsString, MinLength, MaxLength } from 'class-validator';

export class UpdateStoreDto {
  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'Name must be at least 3 characters long' })
  @MaxLength(50, { message: 'Name cannot be more than 50 characters' })
  name?: string;

  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'Description must be at least 3 characters long' })
  @MaxLength(200, { message: 'Description cannot be more than 200 characters' })
  description?: string;
}
