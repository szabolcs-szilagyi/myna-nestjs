import { Transform } from "class-transformer";
import { IsInt, IsString, Max, MaxLength, Min } from "class-validator";
import { emailPurification } from "../../utils/email-purification";
import { mildPurification } from "../../utils/mild-purification";
import { strictPurification } from "../../utils/strict-purification";

export class AddressDataDto {
  @IsInt()
  @Min(0)
  @Max(1)
  type: number;

  @IsString()
  @Transform(({ value }) => emailPurification(value))
  email: string;

  // @IsString()
  // @Transform(({ value }) => strictPurification(value))
  // sessionToken: string;

  @IsString()
  name: string;

  @IsString()
  @Transform(({ value }) => mildPurification(value))
  addressLine1: string;

  @IsString()
  @Transform(({ value }) => mildPurification(value))
  addressLine2: string;

  @IsString()
  @Transform(({ value }) => mildPurification(value))
  city: string;

  @IsString()
  @Transform(({ value }) => mildPurification(value))
  state: string;

  @IsString()
  @Transform(({ value }) => mildPurification(value))
  zip: string;

  @IsString()
  @Transform(({ value }) => mildPurification(value))
  country: string;

  @IsString()
  @Transform(({ value }) => mildPurification(value))
  comment: string;

  @IsString()
  @Transform(({ value }) => mildPurification(value))
  mobile: string;
}
