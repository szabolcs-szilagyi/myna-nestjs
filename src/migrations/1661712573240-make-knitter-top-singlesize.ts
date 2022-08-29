import { kebabCase, omit } from 'lodash/fp';
import { MigrationInterface, QueryRunner, In } from 'typeorm';
import { StockEntity } from '../cart/entities/stock.entity';
import { ProductEntity } from '../product/entities/product.entity';

const productList: (Partial<ProductEntity> & { isUpdate?: boolean })[] = [
  {
    isUpdate: true,
    name: 'DAPHNE Cardigan',
    isOneSize: 1,
  },
  {
    isUpdate: true,
    name: 'ZEPHYRA Vest',
    isOneSize: 1,
  },
];

export class makeKnitterTopSinglesize1661712573240
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const productRepo = queryRunner.manager.getRepository(ProductEntity);
    const stockRepo = queryRunner.manager.getRepository(StockEntity);

    for (const product of productList) {
      const { name, compCare, description, isUpdate } = product;
      const idName = product.idName || kebabCase(name);

      if (isUpdate) {
        const newProductData = {
          ...product,
          ...(compCare
            ? { compCare: `<div class="ju">${compCare}</div>` }
            : {}),
          ...(description
            ? { description: `<div class="ju">${description}</div>` }
            : {}),
        };
        await productRepo.update(
          { idName },
          omit(['idName', 'isUpdate'], newProductData),
        );
      }

      await stockRepo.manager.upsert(
        StockEntity,
        { idName, xs: null, s: null, m: null, ml: null, l: null, oneSize: 5 },
        ['idName'],
      );
    }
  }

  /**
   * NOTE: on revert we won't undo the updates that were made on the products.
   * We will only remove the new products.
   */
  public async down(queryRunner: QueryRunner): Promise<void> {
    const productRepo = queryRunner.manager.getRepository(ProductEntity);
    const stockRepo = queryRunner.manager.getRepository(StockEntity);

    for (const product of productList) {
      const { name } = product;
      const idName = product.idName || kebabCase(name);
      await stockRepo.manager.upsert(
        StockEntity,
        { idName, xs: 5, s: 5, m: 5, ml: 5, l: 5, oneSize: null },
        ['idName'],
      );
      await productRepo.update({ idName }, { isOneSize: null });
    }
  }
}
