import { MiddlewareConsumer, Module } from '@nestjs/common';
import { SessionMiddleware } from './session.middleware';

@Module({})
export class TestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SessionMiddleware).forRoutes('*');
  }
}
