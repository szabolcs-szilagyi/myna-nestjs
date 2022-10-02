import { kebabCase, omit } from 'lodash/fp';
import { MigrationInterface, QueryRunner, In } from 'typeorm';
import { StockEntity } from '../cart/entities/stock.entity';
import { ProductEntity } from '../product/entities/product.entity';

const productList: (Partial<ProductEntity> & { isUpdate?: boolean })[] = [
  {
    name: 'LINA Hand Painted Scarf',
    price: 115,
    color: 'Dusty Pink',
    description:
      'LINA scarf is hand made from 100% non – violent silk (peace silk). 90 cm / 90 cm.<br />Our scarf is hand made by our creative designer Justyna Lysak-Szilagyi.Every scarf begins as a piece of white non - violent (peace silk). The outlines are hand - applied in a waterproof resist, and then the silk dyes are painted one brushstroke at a time. The scarf is steamed to set the dyes, than washed in water. Finally, the edges are rolled and carefully stitched.<br /><br />Designed by Justyna and sustainably crafted in Budapest. Made with love and attention to small details.<br />LINA scarf is made to order and may take 1 - 2 weeks to be handcrafted with care, especially for you.',
    compCare:
      '100% non violent silk (peace silk) breeding and production. It allows the metamorphosis of the silkworm to a butterfly to be completed so that no animal has to suffer or die for fashion.<br />Peace Silk (non-violent silk also called Ahimsa Silk) is manufactured under the strictest social and environmental standards in India.<br /><br />Wash LINA on a gentle cycle at 30 degrees, iron on a low level, and do not tumble dry. Our fabrics are durable and do not require dry cleaning.',
    isOneSize: 1,
  },
];

export class addScarf1664650292227 implements MigrationInterface {
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
      } else {
        await productRepo.insert({
          ...product,
          idName,
          compCare: `<div class="ju">${compCare}</div>`,
          description: `<div class="ju">${description}</div>`,
          availability: 'Available',
          pic1: `${idName}-01.jpg`,
          pic2: `${idName}-02.jpg`,
          pic3: `${idName}-03.jpg`,
          pic4: `${idName}-04.jpg`,
        });
      }

      if (product.isOneSize) {
        await stockRepo.manager.upsert(
          StockEntity,
          { idName, xs: null, s: null, m: null, ml: null, l: null, oneSize: 5 },
          ['idName'],
        );
      } else {
        await stockRepo.manager.upsert(
          StockEntity,
          { idName, xs: 5, s: 5, m: 5, ml: 5, l: 5 },
          ['idName'],
        );
      }
    }
  }

  /**
   * NOTE: on revert we won't undo the updates that were made on the products.
   * We will only remove the new products.
   */
  public async down(queryRunner: QueryRunner): Promise<void> {
    const productRepo = queryRunner.manager.getRepository(ProductEntity);
    const stockRepo = queryRunner.manager.getRepository(StockEntity);

    const toRemove = productList.reduce((memo, { idName, name, isUpdate }) => {
      if (!isUpdate) {
        const idNameToDelete = idName || kebabCase(name);
        memo.push(idNameToDelete);
      }
      return memo;
    }, []);

    await stockRepo.delete({
      idName: In(toRemove),
    });
    await productRepo.delete({
      idName: In(toRemove),
    });
  }
}
