import { ConnectionOptions } from 'typeorm';

// You can load you .env file here synchronously using dotenv package (not installed here),
import * as dotenv from 'dotenv';
const environment = process.env.NODE_ENV || 'development';
dotenv.config({
  path: `${__dirname}/../.${environment}.env`,
});

const sslOptions = {
  production: { rejectUnauthorized: false },
  staging: { rejectUnauthorized: false },
  development: false,
  test: false,
};

let dbURL: string;

if (environment === 'test') {
  dbURL = 'postgres://myna_test:test@127.0.0.1/myna_test';
} else {
  dbURL = process.env.DATABASE_URL;
}

// Check typeORM documentation for more information.
const config: ConnectionOptions = {
  type: 'postgres',
  url: dbURL,
  ssl: sslOptions[environment],
  entities: [__dirname + '/**/*.entity{.ts,.js}'],

  // We are using migrations, synchronize should be set to false.
  synchronize: false,

  // Run migrations automatically,
  // you can disable this if you prefer running migration manually.
  migrationsRun: false,
  logging: ['error', 'warn', 'info'],
  //logger: 'file',

  // allow both start:prod and start:dev to use migrations
  // __dirname is either dist or src folder, meaning either
  // the compiled js in prod or the ts in dev
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  cli: {
    migrationsDir: 'src/migrations',
  },
};

export = config;
