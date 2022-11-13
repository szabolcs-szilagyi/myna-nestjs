import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CartRepository } from './cart.repository';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { StockRepository } from './stock.repository';
import { PurchasedRepository } from './purchased.repository';
import { StockEntity } from './entities/stock.entity';
import { MoreAccurateAvailablityDto } from './dto/more-accurate-availablity.dto';
import { sumBy } from 'lodash';
import { CartEntity } from './entities/cart.entity';
import { TransactionalRepository } from '../transactional-repository/transactional-repository';
import { PurchaseLogService } from '../purchase-log/purchase-log.service';
import { EmailService } from '../email/email.service';
import { UserDataDto } from '../session/user-data.dto';

type Coupon = 'mynafriend10' | 'mynagift15' | 'summersale20' | 'amazingdeal';

class InternalServerError extends InternalServerErrorException {
  public errors: Error[];

  constructor(objectOrError?: string | any, description?: string) {
    super(objectOrError, description);
  }
}

@Injectable()
export class CartService {
  constructor(
    private readonly cartRepository: CartRepository,
    private readonly stockRepository: StockRepository,
    private readonly transactionalRepo: TransactionalRepository,
    private readonly purchaseLogService: PurchaseLogService,
    private readonly emailService: EmailService,
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
    const validCoupons: Record<Coupon, number> = {
      mynafriend10: 0.9,
      mynagift15: 0.85,
      summersale20: 0.8,
      amazingdeal: 0.5,
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
    const cartRepo = this.transactionalRepo.getCustomRepository(CartRepository);
    const stockRepo = this.transactionalRepo.getCustomRepository(
      StockRepository,
    );
    const purchasedRepo = this.transactionalRepo.getCustomRepository(
      PurchasedRepository,
    );

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
      this.purchaseLogService.recordPurchase(products);
    }

    return products;
  }

  async completePurchase(
    sessionId: string,
    userData: UserDataDto,
    price: string,
  ) {
    const errors: Error[] = [];

    const products: CartEntity[] = await this.setProductsPaid(
      null,
      sessionId,
      userData.email,
    ).catch((e) => {
      errors.push(e);
      return [];
    });

    await this.emailService
      .sendPurchaseEmailNew(userData, products, price)
      .catch((e) => errors.push(e));

    if (errors.length) {
      const err = new InternalServerError(
        'Something went wrong completing the order',
      );
      err.errors = errors;

      throw err;
    }
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
      (item) => item.amount * item.product.price,
    );
    const withCoupon = this.applyCoupon(productTotal, <Coupon>coupon);

    return withCoupon;
  }
}
