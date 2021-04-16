import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { CartRepository } from './cart.repository';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { StockRepository } from './stock.repository';
import { PurchasedRepository } from './purchased.repository';
import { StockEntity } from './entities/stock.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartRepository)
    private readonly cartRepository: CartRepository,
    @InjectRepository(StockRepository)
    private readonly stockRepository: StockRepository,
    @InjectRepository(PurchasedRepository)
    private readonly purchasedRepository: PurchasedRepository,
    @InjectConnection()
    private readonly connection: Connection,
  ) {}

  async addProductToCart(
    addToCartDto: AddToCartDto,
    sessionToken: string
  ): Promise<void> {
    await this.cartRepository.insert({
      ...addToCartDto,
      sessionToken,
      amount: 1,
      paid: 0,
    });
  }

  async removeProductFromCart(id: number, sessionToken: string): Promise<void> {
    await this.cartRepository.delete({ id, sessionToken })
  }

  getProductsInCart(sessionToken: string) {
    return this.cartRepository.getProductsInCart(sessionToken);
  }

  async setProductsPaid(sessionToken: string, email: string) {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    const cartRepo = queryRunner.manager.getCustomRepository(CartRepository);
    const stockRepo = queryRunner.manager.getCustomRepository(StockRepository);
    const purchasedRepo = queryRunner.manager.getCustomRepository(PurchasedRepository);
    try {
      const products = await cartRepo.getProductsInCart(sessionToken);
      for(const product of products) {
        await stockRepo.reduceStock(product.idName, product.size);
        await cartRepo.setProductPaid(product);
      }
      await purchasedRepo.insert({ email, sessionToken, time: new Date() });

      await queryRunner.commitTransaction();
    } catch(e) {
      console.log(e);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }

    return {};
  }

  getAvailability(idName: string): Promise<StockEntity> {
    return this.stockRepository.getAvailability(idName);
  }
}
