import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartRepository } from './cart.repository';
import { StockRepository } from './stock.repository';
import { PurchasedRepository } from './purchased.repository';
import { TokenModule } from '../token/token.module';
import { AddressModule } from '../address/address.module';
import { PurchaseLogModule } from '../purchase-log/purchase-log.module';
import { TransactionalRepositoryModule } from '../transactional-repository/transactional-repository.module';
import { EmailModule } from '../email/email.module';
import { ProductRepository } from '../product/product.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CartRepository,
      StockRepository,
      PurchasedRepository,
      ProductRepository,
    ]),
    TransactionalRepositoryModule,
    TokenModule,
    AddressModule,
    PurchaseLogModule,
    EmailModule,
  ],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
