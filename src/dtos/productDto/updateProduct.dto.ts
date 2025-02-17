import { IsString, IsNumber, IsOptional } from 'class-validator';

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  product_name?: string;

  @IsNumber()
  @IsOptional()
  product_price?: number;
}
