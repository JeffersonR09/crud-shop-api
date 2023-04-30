import {
  IsString,
  IsNotEmpty,
  MinLength,
  IsNumber,
  IsArray,
  IsOptional,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  titulo: string;

  @IsNumber()
  precio: number;

  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  images?: string[];
}
