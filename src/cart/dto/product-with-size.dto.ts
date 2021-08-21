import { StockEntity } from '../entities/stock.entity';

export class ProductWithSizeDto {
  idName: string;
  size: keyof Omit<StockEntity, 'id' | 'idName'>;
}
