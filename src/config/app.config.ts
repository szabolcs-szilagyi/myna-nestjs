import { registerAs } from '@nestjs/config';

const {
  EMAIL_SMTP_HOST,
  EMAIL_SMTP_PORT,
  EMAIL_SMTP_USER,
  EMAIL_SMTP_PASS,
} = process.env;

export const AppConfig = registerAs('app', () => {
  return {
    emailConfig: {
      senderEmail: 'MYNA <connect@mynalabel.com>',
      smtp: {
        host: EMAIL_SMTP_HOST,
        port: parseInt(EMAIL_SMTP_PORT, 10),
        auth: {
          user: EMAIL_SMTP_USER,
          pass: EMAIL_SMTP_PASS,
        },
      },
      frontEndHost: process.env.FRONTEND_HOST,
    },
    host: process.env.HOST,
  };
});
