import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const { NODE_ENV } = process.env;

const devEnv = new Set([undefined, 'dev', 'development', '127.0.0.1']);
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
  app.enableShutdownHooks();
  await app.listen(process.env.PORT || 7000);
}
bootstrap();
