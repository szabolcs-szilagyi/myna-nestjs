import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const { NODE_ENV } = process.env;

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
  await app.listen(process.env.PORT || 7000);
}
bootstrap();
