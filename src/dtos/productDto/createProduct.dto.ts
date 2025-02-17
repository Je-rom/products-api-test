import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  product_name!: string;

  @IsNumber()
  @IsNotEmpty()
  product_price!: number;
}
