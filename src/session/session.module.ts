import { MiddlewareConsumer } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionMiddleware } from './session.middleware';
import { SessionRepository } from './session.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([SessionRepository])
  ],
  providers: [
    SessionMiddleware,
  ]
})
export class SessionModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SessionMiddleware).forRoutes('*');
  }
}
