import { Injectable } from '@nestjs/common';
import { PurchaseEmailDto } from './dto/purchase-email.dto';
import { NewsletterSubscriptionEmailDto } from './dto/newsletter-subscription-email.dto';
import { ConfigService } from '@nestjs/config';
import { Transporter, createTransport } from 'nodemailer';
import { CartEntity } from '../cart/entities/cart.entity';
import { UserDataDto } from '../session/user-data.dto';

export interface PreparedEmail {
  to: string;
  subject: string;
  textBody: string;
  htmlBody: string;
};

@Injectable()
export class EmailService {
  private readonly client: Transporter;
  private readonly host: string;
  private readonly senderEmail: string;

  constructor(private readonly configService: ConfigService) {
    const config = this.configService.get('app.emailConfig');
    this.host = config.frontEndHost;
    this.senderEmail = config.senderEmail;

    this.client = createTransport(config.smtp);
  }

  async sendEmail(preparedEmail: PreparedEmail): Promise<void> {
    try {
      await this.client.sendMail({
        from: this.senderEmail,
        to: preparedEmail.to,
        bcc: this.senderEmail,
        subject: preparedEmail.subject,
        text: preparedEmail.textBody,
        html: preparedEmail.htmlBody,
      });
    } catch (e) {
      console.log(
        'Error in sending email:',
        e.message,
        'data:',
        JSON.stringify(preparedEmail),
      );
      throw e;
    }
  }

  async sendPurchaseEmail(purchaseEmailDto: PurchaseEmailDto) {
    const subject = 'New Order';
    const { textBody, htmlBody } = Object.entries(purchaseEmailDto).reduce(
      (memo, [key, value]) => {
        memo.textBody += `${key}: ${value}\r\n\r\n`;
        memo.htmlBody += `${key}: ${value}<br />`;
        return memo;
      },
      { textBody: '', htmlBody: '' },
    );

    const preparedEmail = {
      to: purchaseEmailDto.customerEmail,
      subject,
      textBody,
      htmlBody,
    } as PreparedEmail;

    await this.sendEmail(preparedEmail);
  }

  async sendPurchaseEmailNew(userData: UserDataDto, products: Pick<CartEntity, 'idName' | 'size'>[]) {
    const subject = 'New Order';
    const productList = products.reduce(
      (memo, product: CartEntity, index) => {
        const separator = index === 0 ? '' : ', '
        memo += `${separator}${product.idName} - ${product.size}`;
        return memo;
      },
      '',
    )

    const { textBody, htmlBody } = Object.entries({ ...userData, products: productList }).reduce(
      (memo, [key, value]) => {
        memo.textBody += `${key}: ${value}\r\n\r\n`;
        memo.htmlBody += `${key}: ${value}<br />`;
        return memo;
      },
      { textBody: '', htmlBody: '' },
    );

    const preparedEmail = {
      to: userData.email,
      subject,
      textBody,
      htmlBody,
    } as PreparedEmail;

    await this.sendEmail(preparedEmail);
  }

  async sendNewsletterConfirmationEmail(
    newsletterSubscriptionEmailDto: NewsletterSubscriptionEmailDto,
  ) {
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

  async sendSubscribedEmail(
    newsletterSubscriptionEmailDto: NewsletterSubscriptionEmailDto,
  ) {
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

  async sendUnsubscribedEmail(
    newsletterSubscriptionEmailDto: NewsletterSubscriptionEmailDto,
  ) {
    const preparedEmail = {
      to: newsletterSubscriptionEmailDto.email,
      subject: 'Unsubscribed',
      textBody: 'You have successfully unsubscribed from our newsletters!',
      htmlBody:
        '<p>You have successfully unsubscribed from our newsletters!</p>',
    } as PreparedEmail;

    await this.sendEmail(preparedEmail);
  }
}
