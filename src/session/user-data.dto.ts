import { Expose } from 'class-transformer';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UserDataDto {
  @Expose()
  @IsString()
  @MaxLength(1024)
  name: string;

  @Expose()
  @IsString()
  @MaxLength(1024)
  email: string;

  @Expose()
  @IsString()
  @MaxLength(1024)
  mobile: string;

  @Expose()
  @IsString()
  @MaxLength(1024)
  addressLine1: string;

  @Expose()
  @IsString()
  @IsOptional()
  @MaxLength(1024)
  addressLine2?: string;

  @Expose()
  @IsString()
  @MaxLength(1024)
  city: string;

  @Expose()
  @IsString()
  @MaxLength(1024)
  state: string;

  @Expose()
  @IsString()
  @MaxLength(256)
  zip: string;

  @Expose()
  @IsString()
  @MaxLength(256)
  country: string;

  @Expose()
  @IsString()
  @IsOptional()
  @MaxLength(1024)
  comment?: string;
}
