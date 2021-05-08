import { IsOptional, IsIn, IsNotEmpty, IsEnum } from "class-validator";

export class ProductFilterDto {
  @IsOptional()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsNotEmpty()
  idName: string;
}
