import { StockEntity } from 'src/cart/entities/stock.entity';
import { MigrationInterface, QueryRunner, In } from 'typeorm';

const productList: string[] = [
  'liliana-overall',
  'aster-trousers-satin',
  'aster-trousers-sand',
  'aster-shorts-satin',
  'aster-shorts-sand',
  'narci-skirt',
  'irisa-top',
  'liana-blouse-sunrise',
  'liana-blouse-ocean',
];

export class addStockForNewProducts1652559116169 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const stockRepo = queryRunner.manager.getRepository(StockEntity);
    for (const idName of productList) {
      stockRepo.insert({
        idName,
        xs: 5,
        s: 5,
        m: 5,
        ml: 5,
        l: 5,
      });
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const stockRepo = queryRunner.manager.getRepository(StockEntity);
    stockRepo.delete({
      idName: In(productList),
    });
  }
}
