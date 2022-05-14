import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { NewsletterEntity } from './entities/newsletter.entity';
import { NewsletterRepository } from './newsletter.repository';
import * as crypto from 'crypto';
import { EmailService } from '../email/email.service';

@Injectable()
export class NewsletterService {
  constructor(
    @InjectRepository(NewsletterRepository)
    private readonly newsletterRepository: NewsletterRepository,
    @InjectConnection()
    private readonly connection: Connection,
    private readonly emailService: EmailService,
  ) {}

  async subscribe(email: string): Promise<string> {
    const alreadySubscribed = await this.newsletterRepository.findOne(
      { email },
      { select: ['id'] },
    );

    if (alreadySubscribed) return '';

    let token = crypto.randomBytes(16).toString('hex');
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    await queryRunner.manager.insert(NewsletterEntity, {
      email,
      enabled: false,
      subscribeDate: new Date(),
      token,
    });

    try {
      await this.emailService.sendNewsletterConfirmationEmail({ email, token });
      await queryRunner.commitTransaction();
    } catch (e) {
      token = '';
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }

    return token;
  }

  async confirm(email: string, token: string): Promise<number> {
    const result = await this.newsletterRepository.update(
      { token },
      { enabled: true },
    );
    await this.emailService.sendSubscribedEmail({ email, token });

    return result.affected;
  }

  async unsubscribe(email: string, token: string): Promise<number> {
    const result = await this.newsletterRepository.delete({ email, token });
    await this.emailService.sendUnsubscribedEmail({ email, token });

    return result.affected;
  }
}
