import { Repository, EntityRepository } from 'typeorm';
import { ProductEntity } from './entities/product.entity';

@EntityRepository(ProductEntity)
export class ProductRepository extends Repository<ProductEntity> {
  getBasicProductInfos(): Promise<
    Pick<ProductEntity, 'idName' | 'price' | 'pic1'>[]
  > {
    return this.find({
      select: ['idName', 'price', 'pic1'],
    });
  }
}
