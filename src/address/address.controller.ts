import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { CustomHeaders } from '../token/decorators/custom-headers.decorator';
import { PurifiedToken } from '../token/decorators/purified-token.decorator';
import { EmailStripperPipe } from '../token/pipes/email-stripper.pipe';
import { TokenService } from '../token/token.service';
import { AddressService } from './address.service';
import { AddressEntity } from './entities/address.entity';
import omit from 'lodash.omit';
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
  async getShippingInfo(@PurifiedToken('session-token') sessionToken: string) {
    const email = await this.tokenService.getEmailBySessionToken(sessionToken);
    const address = await this.addressService.getAddressDataByEmail(email);
    const shippingInfo = this.addressService.getShippingInfo(address?.country);

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
      addressData = omit(
        await this.addressService.getAddressDataByEmail(email),
        ['id', 'sessionToken', 'email', 'name'],
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
