import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AddressRepository } from './address.repository';
import { AddressEntity } from './entities/address.entity';

@Injectable()
export class AddressService {
  static euCountries = new Set([
    'austria',
    'belgium',
    'bulgaria',
    'croatia',
    'cyprus',
    'czech republic',
    'denmark',
    'estonia',
    'finland',
    'france',
    'germany',
    'greece',
    'hungary',
    'ireland',
    'italy',
    'latvia',
    'lithuania',
    'luxembourg',
    'malta',
    'netherlands',
    'portugal',
    'romania',
    'slovakia',
    'slovenia',
    'spain',
    'sweden',
    'united kingdom',
  ]);

  constructor(
    @InjectRepository(AddressRepository)
    private readonly addressRepository: AddressRepository,
  ) {}

  async getAddressDataByEmail(email: string): Promise<AddressEntity> {
    const availableAddresses = await this.addressRepository.find({
      where: { email },
      order: { id: 'DESC' },
      take: 1,
    })

    return availableAddresses[0];
  }

  getDeliveryCost(country: string) {
    country = country.toLowerCase();

    if(country === 'poland') {
      return 0;
    } else if (AddressService.euCountries.has(country)) {
      return 10;
    } else {
      return 25;
    }
  }

  getShippingInfo(country: string) {
    if(country === '0' || !country) {
			return 'Plus shipping fee';
    }

    const deliveryCost = this.getDeliveryCost(country);
    if(deliveryCost === 0) return 'incl. free shipping'
    if(deliveryCost === 10) return 'incl. €10 shipping fee (EU)'
		if(deliveryCost === 25) return 'incl. €25 shipping fee (Non-EU)';
  }

  async upsertAddressData(address: AddressEntity): Promise<void> {
    const existingAddressData = await this.getAddressDataByEmail(address.email);

    if (existingAddressData) {
      await this.addressRepository.update({ email: address.email }, address);
    } else {
      await this.addressRepository.insert(address);
    }
  }
}
