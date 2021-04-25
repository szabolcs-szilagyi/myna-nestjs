import { MiddlewareConsumer, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AddressModule } from "./address/address.module";
import { CartModule } from "./cart/cart.module";
import { TypeOrmConfigService } from "./config/database";
import { NewsletterModule } from "./newsletter/newsletter.module";
import { ProductModule } from "./product/product.module";
import { TokenModule } from "./token/token.module";
import { UserModule } from "./user/user.module";
import { AppController } from './app.controller';
import { catchAllOmiter } from "./app.middleware";
import { AppConfig } from './config/app.config';
import { EmailModule } from "./email/email.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: true,
      load: [AppConfig]
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TypeOrmConfigService,
    }),
    CartModule,
    AddressModule,
    NewsletterModule,
    ProductModule,
    TokenModule,
    UserModule,
    EmailModule,
  ],
  controllers: [AppController],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(catchAllOmiter)
      .forRoutes('*')
  }
}
