import { MiddlewareConsumer } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionMiddleware } from './session.middleware';
import { SessionRepository } from './session.repository';
import { SessionController } from './session.controller';
import { userDataProvider, USER_DATA } from './user-data';

@Module({
  imports: [TypeOrmModule.forFeature([SessionRepository])],
  providers: [SessionMiddleware, userDataProvider],
  controllers: [SessionController],
  exports: [USER_DATA],
})
export class SessionModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(SessionMiddleware)
      .exclude('legacy*')
      .forRoutes('*');
  }
}
