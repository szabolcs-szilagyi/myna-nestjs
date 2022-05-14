import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressModule } from './address/address.module';
import { CartModule } from './cart/cart.module';
import { NewsletterModule } from './newsletter/newsletter.module';
import { ProductModule } from './product/product.module';
import { TokenModule } from './token/token.module';
import { UserModule } from './user/user.module';
import { AppController } from './app.controller';
import { catchAllOmiter } from './app.middleware';
import { AppConfig } from './config/app.config';
import { EmailModule } from './email/email.module';
import { SessionModule } from './session/session.module';
import { TransactionalRepositoryModule } from './transactional-repository/transactional-repository.module';

import * as typeOrmConfig from './ormconfig';

const environment = process.env.NODE_ENV || 'development';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [AppConfig],
      envFilePath: `.${environment}.env`,
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
    CartModule,
    AddressModule,
    NewsletterModule,
    ProductModule,
    TokenModule,
    UserModule,
    EmailModule,
    SessionModule,
    TransactionalRepositoryModule,
  ],
  controllers: [AppController],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(catchAllOmiter).forRoutes('*');
  }
}
