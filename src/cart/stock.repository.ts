import { EntityRepository, Repository } from "typeorm";
import { StockEntity } from "./entities/stock.entity";

@EntityRepository(StockEntity)
export class StockRepository extends Repository<StockEntity> {
  async reduceStock(idName: string, size: string) {
    if(size === 'onesize') size = 'oneSize';
    await this.decrement({ idName }, size, 1);
  }

  getAvailability(idName: string): Promise<StockEntity> {
    return this.findOne({ idName });
  }
}
