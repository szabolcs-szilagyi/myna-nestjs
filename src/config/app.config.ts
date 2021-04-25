import { registerAs } from "@nestjs/config";

const { NODE_ENV } = process.env;

const dbSsl = {
    production: { rejectUnauthorized: false },
    staging: { rejectUnauthorized: false },
    development: false,
}

export const AppConfig = registerAs('app', () => ({
  senderEmail: 'connect@mynalabel.com',
  // senderEmail: 'szabolcs.szilagyi@gmx.com',
  frontEndHost: process.env.HOST || `http://localhost:3000`,
  host: process.env.HOST || `http://localhost:7000`,
  awsAccessKeyId: process.env.ACCESS_KEY_ID,
  awsSecretAccessKey: process.env.SECRET_ACCESS_KEY,
  awsRegion: 'eu-west-3',
  url: process.env.DB_HOST || 'postgres://myna_dev:developer@127.0.0.1/myna_dev',
  dbSsl: dbSsl[NODE_ENV],
  synchronize: process.env.DB_SYNC === 'true' || false,
}));
