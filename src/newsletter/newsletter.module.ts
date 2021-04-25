import { Module } from '@nestjs/common';
import { NewsletterService } from './newsletter.service';
import { NewsletterController } from './newsletter.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsletterRepository } from './newsletter.repository';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([NewsletterRepository]),
    EmailModule,
  ],
  controllers: [NewsletterController],
  providers: [NewsletterService]
})
export class NewsletterModule {}
