import { NestFactory } from '@nestjs/core';
import * as session from 'express-session';
import { AppModule } from './app.module';

const {
  NODE_ENV,
  SESSION_SECRET = 'my-super-secret-dev-secret-66',
} = process.env;

const devEnv = new Set([undefined, 'dev', 'development']);
const isDevelopmentEnv = devEnv.has(NODE_ENV);
const origin = isDevelopmentEnv || /mynalabel\.com$/;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });
  app.use(
    session({
      secret: SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
      name: `${NODE_ENV || 'development'}-myna`,
      cookie: {
        domain: '*',
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: isDevelopmentEnv,
        secure: !isDevelopmentEnv,
      },
    }),
  );
  await app.listen(process.env.PORT || 7000);
}
bootstrap();
