import { IsNotEmpty, IsOptional } from 'class-validator';
import { Types } from 'mongoose';
export class CreateCategoryDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  description: string;
}

export class UpdateCategoryDto {
  @IsOptional()
  name: string;

  @IsOptional()
  description: string;
}
