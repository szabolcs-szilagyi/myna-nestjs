import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const devEnv = new Set([undefined, 'dev', 'development']);
const origin = devEnv.has(process.env.NODE_ENV) || /mynalabel\.com$/;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
      origin,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      preflightContinue: false,
      optionsSuccessStatus: 204
  })
  await app.listen(process.env.PORT || 7000);
}
bootstrap();
