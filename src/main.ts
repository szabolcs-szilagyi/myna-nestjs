import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const origin = process.env.NODE_ENV === 'development' || /mynalabel\.com$/;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
      origin,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      preflightContinue: false,
      optionsSuccessStatus: 204
  })
  await app.listen(process.env.PORT || 6000);
}
bootstrap();
