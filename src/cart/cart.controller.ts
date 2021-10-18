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
import { AddressService } from '../address/address.service';
import { PurifiedToken } from '../token/decorators/purified-token.decorator';
import { TokenService } from '../token/token.service';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { MoreAccurateAvailablityDto } from './dto/more-accurate-availablity.dto';
import { ProductWithSizeDto } from './dto/product-with-size.dto';

@Controller('cart')
export class CartController {
  constructor(
    private readonly cartService: CartService,
    private readonly tokenService: TokenService,
    private readonly addressSevice: AddressService,
  ) {}

  @Post()
  async addProduct(
    @PurifiedToken('session-token') sessionToken: string,
    @Body(ValidationPipe) addToCartDto: AddToCartDto,
  ) {
    if (!sessionToken) throw new BadRequestException();

    await this.cartService.addProductToCart(addToCartDto, sessionToken);

    return { success: '1' };
  }

  @Delete(':id')
  async removeProduct(
    @PurifiedToken('session-token') sessionToken: string,
    @Param('id', ParseIntPipe) id: number,
  ) {
    if (!id || !sessionToken) throw new BadRequestException();

    await this.cartService.removeProductFromCart(id, sessionToken);

    return { success: '1' };
  }

  @Get('products-in-cart')
  async getProductsInCart(
    @PurifiedToken('session-token') sessionToken: string,
  ) {
    if (!sessionToken) throw new BadRequestException();

    const products = this.cartService.getProductsInCart(sessionToken);

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
