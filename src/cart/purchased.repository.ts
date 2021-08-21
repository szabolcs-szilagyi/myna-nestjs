import { EntityRepository, Repository } from 'typeorm';
import { PurchasedEntity } from './entities/purchased.entity';

@EntityRepository(PurchasedEntity)
export class PurchasedRepository extends Repository<PurchasedEntity> {}
