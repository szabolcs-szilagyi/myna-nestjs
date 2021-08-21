import { IsEmail, IsString } from 'class-validator';

export class NewsletterSubscriptionEmailDto {
  @IsEmail()
  email: string;

  @IsString()
  token: string;
}
