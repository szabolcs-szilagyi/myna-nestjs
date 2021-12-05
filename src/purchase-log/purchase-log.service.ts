import { Inject, Injectable } from '@nestjs/common';
import { UserDataDto } from '../session/user-data.dto';
import { CartEntity } from '../cart/entities/cart.entity';
import { TransactionalRepository } from '../transactional-repository/transactional-repository';
import { PurchaseLogRepository } from './purchase-log.repository';
import { USER_DATA } from '../session/user-data';

@Injectable()
export class PurchaseLogService {
  private readonly purchaseLogRepository: PurchaseLogRepository;

  constructor(
    transactionalRepo: TransactionalRepository,
    @Inject(USER_DATA) private readonly userData: UserDataDto,
  ) {
    this.purchaseLogRepository = transactionalRepo.getCustomRepository(
      PurchaseLogRepository,
    );
  }

  async recordPurchase(products: CartEntity[]) {
    this.purchaseLogRepository.insert({
      logData: {
        userData: this.userData,
        products,
      },
    });
  }
}
