import { EntityRepository, Repository } from 'typeorm';
import { PurchaseLogEntity } from './purchase-log.entity';

@EntityRepository(PurchaseLogEntity)
export class PurchaseLogRepository extends Repository<PurchaseLogEntity> {}
