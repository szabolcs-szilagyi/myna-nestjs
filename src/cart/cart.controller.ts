import {
  Controller,
  Post,
  Body,
  BadRequestException,
  Delete,
  Param,
  ParseIntPipe,
  Get,
  Query,
  NotFoundException,
  ValidationPipe,
  Session,
  Header,
} from '@nestjs/common';
import { SessionId } from '../decorators/session-id.decorator';
import { AddressService } from '../address/address.service';
import { PurifiedToken } from '../token/decorators/purified-token.decorator';
import { TokenService } from '../token/token.service';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { MoreAccurateAvailablityDto } from './dto/more-accurate-availablity.dto';
import { ProductWithSizeDto } from './dto/product-with-size.dto';
import { CartEntity } from './entities/cart.entity';
import { promisify } from 'util';
import { omit } from 'lodash/fp';
import { TransactionalRepository } from '../transactional-repository/transactional-repository';
import { UserDataDto } from '../session/user-data.dto';
import { Session as ExpressSession } from 'express-session';
import { plainToClass } from 'class-transformer';

@Controller('cart')
export class CartController {
  constructor(
    private readonly cartService: CartService,
    private readonly tokenService: TokenService,
    private readonly addressSevice: AddressService,
    private readonly transactionalRepo: TransactionalRepository,
  ) {}

  @Post()
  async addProduct(
    @Session() session: any,
    @SessionId() sessionId: string,
    @PurifiedToken('session-token') sessionToken: string,
    @Body(ValidationPipe) addToCartDto: AddToCartDto,
  ) {
    if (!sessionToken && !sessionId) throw new BadRequestException();

    if (sessionToken) {
      await this.cartService.addProductToCart(addToCartDto, sessionToken, null);
      return { success: '1' };
    } else {
      // if the client's very first request is to this route the session won't
      // be in the database yet, hence we save it as a first step
      await promisify(session.save.bind(session))();

      await this.cartService.addProductToCart(
        addToCartDto,
        sessionId,
        sessionId,
      );
    }
  }

  @Delete(':id')
  async removeProduct(
    @SessionId() sessionId: string,
    @PurifiedToken('session-token') sessionToken: string,
    @Param('id', ParseIntPipe) id: number,
  ) {
    if (!id || (!sessionToken && !sessionId)) throw new BadRequestException();

    if (sessionToken) {
      await this.cartService.removeProductFromCart(id, sessionToken, null);
      return { success: '1' };
    } else {
      await this.cartService.removeProductFromCart(id, null, sessionId);
    }
  }

  @Get('products-in-cart')
  @Header('cache-control', 'no-store')
  async getProductsInCart(
    @SessionId() sessionId: string,
    @PurifiedToken('session-token') sessionToken: string,
  ) {
    let products: Omit<CartEntity, 'session' | 'sessionToken'>[];

    if (sessionToken) {
      products = await this.cartService.getProductsInCart(sessionToken, null);
    } else {
      products = await this.cartService.getProductsInCart(null, sessionId);
    }

    products = <Omit<CartEntity, 'session' | 'sessionToken'>[]>(
      products.map(omit(['session', 'sessionToken']))
    );

    return products;
  }

  @Post('products-paid')
  async productsPaid(
    @Session() session: any,
    @SessionId() sessionId: string,
    @PurifiedToken('session-token') sessionToken: string,
  ) {
    const getEmail = sessionToken
      ? () => this.tokenService.getEmailBySessionToken(sessionToken)
      : () => Promise.resolve(session.email);
    const email = await getEmail();

    if (!email) throw new BadRequestException();
    const result = await this.transactionalRepo.withTransaction(() =>
      this.cartService.setProductsPaid(sessionToken, sessionId, email),
    );
    return result;
  }

  @Post('complete-purchase')
  async completePurchase(
    @SessionId() sessionId: string,
    @Session() session: ExpressSession,
  ) {
    const userData = plainToClass(UserDataDto, session, {
      excludeExtraneousValues: true,
    });
    await this.cartService.completePurchase(sessionId, userData);
  }

  @Get('availability')
  async getAvailability(@Query() productWithSizeDto: ProductWithSizeDto) {
    if (!productWithSizeDto.idName || !productWithSizeDto.size)
      throw new BadRequestException();

    const stockRecord = await this.cartService.getAvailability(
      productWithSizeDto.idName,
    );
    if (stockRecord === undefined) throw new NotFoundException();

    return { availability: stockRecord?.[productWithSizeDto.size] };
  }

  @Get('more-accurate-availability')
  @Header('cache-control', 'no-store')
  async getMoreAccurateAvailability(
    @SessionId() sessionId: string,
    @PurifiedToken('session-token') sessionToken: string,
    @Query()
    moreAccurateAvailablityDto: Omit<
      MoreAccurateAvailablityDto,
      'sessionToken'
    >,
  ) {
    const availability = await this.cartService.getMoreAccurateAvailability({
      sessionToken,
      sessionId,
      ...moreAccurateAvailablityDto,
    });

    return { availability };
  }

  @Get('total')
  @Header('cache-control', 'no-store')
  async getTotal(
    @Session() session: any,
    @SessionId() sessionId: string,
    @PurifiedToken('session-token') sessionToken: string,
    @PurifiedToken('coupon') coupon: string,
  ) {
    let country: string;

    if (sessionToken) {
      const email = await this.tokenService.getEmailBySessionToken(
        sessionToken,
      );
      if (email && email !== 'nodata') {
        const address = await this.addressSevice.getAddressDataByEmail(email);
        country = address?.country;
      }
    } else {
      country = session.country;
    }

    const deliveryCost = country
      ? this.addressSevice.getDeliveryCost(country)
      : 0;

    const cartValue = await this.cartService.getCartValue(
      sessionToken,
      sessionId,
      coupon,
    );

    return {
      topay: cartValue + deliveryCost,
      delivery: deliveryCost,
      products: cartValue,
    };
  }
}
