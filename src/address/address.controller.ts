import {
  Body,
  Controller,
  Get,
  Header,
  Inject,
  Post,
  Session,
} from '@nestjs/common';
import { CustomHeaders } from '../token/decorators/custom-headers.decorator';
import { PurifiedToken } from '../token/decorators/purified-token.decorator';
import { EmailStripperPipe } from '../token/pipes/email-stripper.pipe';
import { TokenService } from '../token/token.service';
import { AddressService } from './address.service';
import { AddressEntity } from './entities/address.entity';
import * as lodash from 'lodash/fp';
import { AddressDataDto } from './dto/address-data.dto';

@Controller('address')
export class AddressController {
  constructor(
    @Inject(AddressService)
    private readonly addressService: AddressService,
    @Inject(TokenService)
    private readonly tokenService: TokenService,
  ) {}

  @Get('shipping-info')
  @Header('cache-control', 'no-store')
  async getShippingInfo(
    @PurifiedToken('session-token') sessionToken: string,
    @Session() session: any,
  ) {
    let country: string;
    if (sessionToken) {
      const email = await this.tokenService.getEmailBySessionToken(
        sessionToken,
      );
      const address = await this.addressService.getAddressDataByEmail(email);
      country = address?.country;
    } else {
      country = session.country;
    }
    const shippingInfo = this.addressService.getShippingInfo(country);

    return { shippinginfo: shippingInfo };
  }

  @Get('address-data')
  async getAddressData(
    @PurifiedToken('session-token') sessionToken: string,
    @CustomHeaders('email', EmailStripperPipe) email: string,
  ) {
    const isSessionValid = await this.tokenService.validateSessionTokenStrict(
      sessionToken,
      email,
    );

    let addressData: Omit<
      AddressEntity,
      'id' | 'sessionToken' | 'email' | 'name'
    >;
    if (isSessionValid) {
      addressData = lodash.omit(
        ['id', 'sessionToken', 'email', 'name'],
        await this.addressService.getAddressDataByEmail(email),
      );
    } else {
      addressData = {} as AddressEntity;
    }

    return addressData;
  }

  @Post('address-data')
  async setAddressData(
    @PurifiedToken('session-token') sessionToken: string,
    @Body() addressDataDto: AddressDataDto,
  ) {
    const isSessionValid = await this.tokenService.validateSessionTokenStrict(
      sessionToken,
      addressDataDto.email,
    );

    if (!isSessionValid) return { success: false };

    await this.addressService.upsertAddressData(<AddressEntity>{
      ...addressDataDto,
      sessionToken,
    });
    return { success: true };
  }
}
