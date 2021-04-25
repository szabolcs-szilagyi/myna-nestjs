import { registerAs } from "@nestjs/config";

export const AppConfig = registerAs('app', () => ({
  // senderEmail: 'connect@mynalabel.com',
  senderEmail: 'szabolcs.szilagyi@gmx.com',
  host: process.env.host || 'http://localhost:6000',
  awsAccessKeyId: process.env.ACCESS_KEY_ID,
  awsSecretAccessKey: process.env.SECRET_ACCESS_KEY,
  awsRegion: 'eu-west-3',
  url: process.env.DB_HOST || 'mysql://myca_xdb:ud8UuUIpLJdS9Q!R@127.0.0.1:3306/myca_xdb',
  synchronize: process.env.DB_SYNC === 'true' || false,
}));
