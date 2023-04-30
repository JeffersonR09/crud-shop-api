import {
  IsString,
  IsNotEmpty,
  MinLength,
  IsNumber,
  IsArray,
  IsOptional,
} from 'class-validator';

export class CreateSizesDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  color: string;

  @IsNumber()
  precio: number;

  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  sizes?: string[];
}
