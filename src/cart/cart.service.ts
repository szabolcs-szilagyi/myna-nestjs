import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { CartRepository } from './cart.repository';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { StockRepository } from './stock.repository';
import { PurchasedRepository } from './purchased.repository';
import { StockEntity } from './entities/stock.entity';
import { MoreAccurateAvailablityDto } from './dto/more-accurate-availablity.dto';
import { sumBy } from 'lodash';
import { CartEntity } from './entities/cart.entity';

type Coupon = 'mynafriend10' | 'mynagift15';

@Injectable()
export class CartService {
  constructor(
    private readonly cartRepository: CartRepository,
    private readonly stockRepository: StockRepository,
    private readonly connection: Connection,
  ) {}

  async addProductToCart(
    addToCartDto: AddToCartDto,
    sessionToken: string,
    sessionId: string,
  ): Promise<void> {
    await this.cartRepository.insert({
      ...addToCartDto,
      sessionToken,
      amount: 1,
      paid: false,
      session: sessionId,
    });
  }

  private applyCoupon(price: number, coupon: Coupon) {
    const validCoupons = {
      mynafriend10: 0.9,
      mynagift15: 0.85,
    };

    const reduction = validCoupons?.[coupon];

    if (reduction !== undefined) {
      return price * reduction;
    } else {
      return price;
    }
  }

  async removeProductFromCart(
    id: number,
    sessionToken: string,
    sessionId: string,
  ): Promise<void> {
    if (sessionId) {
      await this.cartRepository.delete({ id, session: sessionId });
    } else {
      await this.cartRepository.delete({ id, sessionToken });
    }
  }

  getProductsInCart(sessionToken: string | null, sessionId: string | null) {
    if (sessionId) {
      return this.cartRepository.getProductsInCart(null, sessionId);
    } else {
      return this.cartRepository.getProductsInCart(sessionToken, null);
    }
  }

  async setProductsPaid(
    sessionToken: string | null,
    sessionId: string,
    email: string,
  ) {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    const cartRepo = queryRunner.manager.getCustomRepository(CartRepository);
    const stockRepo = queryRunner.manager.getCustomRepository(StockRepository);
    const purchasedRepo = queryRunner.manager.getCustomRepository(
      PurchasedRepository,
    );
    try {
      let products: CartEntity[];
      if (sessionToken) {
        products = await cartRepo.getProductsInCart(sessionToken, null);
      } else {
        products = await cartRepo.getProductsInCart(null, sessionId);
      }
      for (const product of products) {
        await stockRepo.reduceStock(product.idName, product.size);
        await cartRepo.setProductPaid(product);
      }
      if (sessionToken) {
        await purchasedRepo.insert({ email, sessionToken, time: new Date() });
      } else {
        // TODO have to implement the log
      }

      await queryRunner.commitTransaction();
    } catch (e) {
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

  async getMoreAccurateAvailability(
    moreAccurateAvailablityDto: MoreAccurateAvailablityDto,
  ) {
    const available = await this.getAvailability(
      moreAccurateAvailablityDto.idName,
    );
    const reserved = await this.cartRepository.getProductReservation(
      moreAccurateAvailablityDto,
    );

    const reservationSum = sumBy(reserved, 'amount');

    return available?.[moreAccurateAvailablityDto.size] - reservationSum;
  }

  async getCartValue(sessionToken: string, sessionId: string, coupon: string) {
    const cartItems = await this.cartRepository.getItemsWithDetails(
      sessionToken,
      sessionId,
      { paid: false },
    );
    const productTotal = sumBy(
      cartItems,
      item => item.amount * item.product.price,
    );
    const withCoupon = this.applyCoupon(productTotal, <Coupon>coupon);

    return withCoupon;
  }
}
