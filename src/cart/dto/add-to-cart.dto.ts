import { IsNotEmpty, IsString } from "class-validator";

export class AddToCartDto {
  @IsNotEmpty()
  @IsString()
  idName: string;

  @IsNotEmpty()
  @IsString()
  size: string;
}
