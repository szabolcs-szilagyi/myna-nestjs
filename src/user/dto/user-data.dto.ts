import { Transform } from "class-transformer";
import { IsDate, IsString } from "class-validator";
import { emailPurification } from "../../utils/email-purification";
import { mildPurification } from "../../utils/mild-purification";

export class UserDataDto {
  @IsString()
  @Transform(({ value }) => emailPurification(value))
  email: string;

  @IsString()
  @Transform(({ value }) => mildPurification(value))
  firstName: string;

  @IsString()
  @Transform(({ value }) => mildPurification(value))
  lastName: string;

  @IsDate()
  @Transform(({ value }) => mildPurification(value))
  birthday: Date;
}
