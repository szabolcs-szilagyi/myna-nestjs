import { registerAs } from "@nestjs/config";

const {
  NODE_ENV = 'development',
  EMAIL_SMTP_HOST = 'smtp.ethereal.email',
  EMAIL_SMTP_PORT = '587',
  EMAIL_SMTP_USER = 'trever.rau@ethereal.email',
  EMAIL_SMTP_PASS = 'eWB9mfuvCtPspHzxy3',
} = process.env;

const dbSsl = {
    production: { rejectUnauthorized: false },
    staging: { rejectUnauthorized: false },
    development: false,
}

export const AppConfig = registerAs('app', () => ({
  emailConfig:  {
    senderEmail: 'connect@mynalabel.com',
    smtp: {
      host: EMAIL_SMTP_HOST,
      port: parseInt(EMAIL_SMTP_PORT, 10),
      auth: {
        user: EMAIL_SMTP_USER,
        pass: EMAIL_SMTP_PASS,
      },
    },
    frontEndHost: process.env.FRONTEND_HOST || 'http://localhost:3000',
  },
  host: process.env.HOST || 'http://localhost:7000',
  dbUrl: process.env.DATABASE_URL || 'postgres://myna_dev:developer@127.0.0.1/myna_dev',
  dbSsl: dbSsl[NODE_ENV],
  synchronize: process.env.DB_SYNC === 'true' || false,
}));
