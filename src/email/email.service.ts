import { Injectable } from '@nestjs/common';
import {
  SESv2Client,
  SendEmailCommand
} from '@aws-sdk/client-sesv2';
import { PurchaseEmailDto } from './dto/purchase-email.dto';
import { NewsletterSubscriptionEmailDto } from './dto/newsletter-subscription-email.dto';
import { ConfigService } from '@nestjs/config';

type PreparedEmail = {
  to: string,
  subject: string,
  textBody: string,
  htmlBody: string,
};

@Injectable()
export class EmailService {
  private readonly client: SESv2Client;
  private readonly host: string;
  private readonly senderEmail: string;

  constructor(
    private readonly configService: ConfigService,
  ) {
      const config = this.configService.get('app');
    this.host = config.host
      this.senderEmail = config.senderEmail;

    this.client = new SESv2Client({
      region: config.awsRegion,
      credentials: {
        accessKeyId: config.awsAccessKeyId,
        secretAccessKey: config.awsSecretAccessKey,
      },
    });
  }

  private async sendEmail(preparedEmail: PreparedEmail): Promise<void> {
    const command = new SendEmailCommand({
      FromEmailAddress: `M Y N A <${this.senderEmail}>`,
      Destination: {
        ToAddresses: ['szabolcs.szilagyi@gmx.com'],
        // ToAddresses: [preparedEmail.to],
        // BccAddresses: [this.senderEmail],
      },
      Content: {
        Simple: {
          Subject: { Data: preparedEmail.subject, Charset: 'UTF-8', },
          Body: {
            Html: { Data: preparedEmail.htmlBody, Charset: 'UTF-8' },
            Text: { Data: preparedEmail.textBody, Charset: 'UTF-8' },
          },
        },
      },
    });

    try {
      await this.client.send(command);
    } catch(e) {
      console.log('Error in sending email:', e.message, 'data:', JSON.stringify(preparedEmail));
      throw e;
    }
  }

  async sendPurchaseEmail(purchaseEmailDto: PurchaseEmailDto) {
    const subject = 'New Order';
    const { textBody, htmlBody } = Object
      .entries(purchaseEmailDto)
      .reduce((memo, [key, value]) => {
        memo.textBody += `${key}: ${value}\r\n\r\n`;
        memo.htmlBody += `${key}: ${value}<br />`;
        return memo;
      }, { textBody: '', htmlBody: '' });

    const preparedEmail = {
      to: purchaseEmailDto.customerEmail,
      subject,
      textBody,
      htmlBody,
    } as PreparedEmail;

    await this.sendEmail(preparedEmail);
  }

  async sendNewsletterConfirmationEmail(newsletterSubscriptionEmailDto: NewsletterSubscriptionEmailDto) {
    const { email, token } = newsletterSubscriptionEmailDto;
    const preparedEmail = {
      to: email,
      subject: 'Confirm newsletter subscription',
      textBody: `Please click here to confirm newsletter subscription: ${this.host}/newsletter?part=subscribenewsletter&token=${token}&email=${email}`,
      htmlBody: `<h2>Confirm newsletter subscription</h2>
<p>Please click here to confirm newsletter subscription:
<a href="${this.host}/newsletter?part=subscribenewsletter&token=${token}&email=${email}">${this.host}/newsletter?part=subscribenewsletter&token=${token}&email=${email}</a>
</p>`,
    } as PreparedEmail;

    await this.sendEmail(preparedEmail);
  }

  async sendSubscribedEmail(newsletterSubscriptionEmailDto: NewsletterSubscriptionEmailDto) {
    const { email, token } = newsletterSubscriptionEmailDto;
    const preparedEmail = {
      to: email,
      subject: 'Subscribed',
      textBody: `You have successfully subscribed to our newsletters! You can unsubscribe on: ${this.host}/newsletter?part=unsubscribe&token=${token}&email=${email}`,
      htmlBody: `<h2>Thank you!</h2>
<p>You have successfully subscribed to our newsletters! You can unsubscribe on:
<a href="${this.host}/newsletter?part=unsubscribe&token=${token}&email=${email}">${this.host}/newsletter?part=unsubscribe&token=${token}&email=${email}</a>
</p>`,
    } as PreparedEmail;

    await this.sendEmail(preparedEmail);
  }

  async sendUnsubscribedEmail(newsletterSubscriptionEmailDto: NewsletterSubscriptionEmailDto) {
    const preparedEmail = {
      to: newsletterSubscriptionEmailDto.email,
      subject: 'Unsubscribed',
      textBody: 'You have successfully unsubscribed from our newsletters!',
      htmlBody: '<p>You have successfully unsubscribed from our newsletters!</p>',
    } as PreparedEmail;

    await this.sendEmail(preparedEmail);
  }
}
