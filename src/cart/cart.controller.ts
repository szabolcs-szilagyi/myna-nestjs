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

@Controller('cart')
export class CartController {
  constructor(
    private readonly cartService: CartService,
    private readonly tokenService: TokenService,
    private readonly addressSevice: AddressService,
  ) {}

  @Post()
  async addProduct(
    @SessionId() sessionId: string,
    @PurifiedToken('session-token') sessionToken: string,
    @Body(ValidationPipe) addToCartDto: AddToCartDto,
  ) {
    if (!sessionToken && !sessionId) throw new BadRequestException();

    if (sessionToken) {
      await this.cartService.addProductToCart(addToCartDto, sessionToken, null);
      return { success: '1' };
    } else {
      console.log('sessionId', sessionId);
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
      await this.cartService.removeProductFromCart(id, sessionToken, sessionId);
    }
  }

  @Get('products-in-cart')
  async getProductsInCart(
    @SessionId() sessionId: string,
    @PurifiedToken('session-token') sessionToken: string,
  ) {
    if (!sessionToken) throw new BadRequestException();
    let products: CartEntity[];

    if (sessionToken) {
      products = await this.cartService.getProductsInCart(sessionToken, null);
    } else {
      products = await this.cartService.getProductsInCart(null, sessionId);
    }

    return products;
  }

  @Post('products-paid')
  async productsPaid(@PurifiedToken('session-token') sessionToken: string) {
    if (!sessionToken) throw new BadRequestException();
    const email = await this.tokenService.getEmailBySessionToken(sessionToken);

    if (!email) throw new BadRequestException();
    return this.cartService.setProductsPaid(sessionToken, email);
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
  async getMoreAccurateAvailability(
    @PurifiedToken('session-token') sessionToken: string,
    @Query()
    moreAccurateAvailablityDto: Omit<
      MoreAccurateAvailablityDto,
      'sessionToken'
    >,
  ) {
    const availability = await this.cartService.getMoreAccurateAvailability({
      sessionToken,
      ...moreAccurateAvailablityDto,
    });

    return { availability };
  }

  @Get('total')
  async getTotal(
    @PurifiedToken('session-token') sessionToken: string,
    @PurifiedToken('coupon') coupon: string,
  ) {
    if (!sessionToken) throw new BadRequestException();

    const email = await this.tokenService.getEmailBySessionToken(sessionToken);

    let deliveryCost: number;
    if (email && email !== 'nodata') {
      const address = await this.addressSevice.getAddressDataByEmail(email);
      deliveryCost = address
        ? this.addressSevice.getDeliveryCost(address.country)
        : 0;
    } else {
      deliveryCost = 0;
    }
    const cartValue = await this.cartService.getCartValue(sessionToken, coupon);

    return {
      topay: cartValue + deliveryCost,
      delivery: deliveryCost,
      products: cartValue,
    };
  }
}
