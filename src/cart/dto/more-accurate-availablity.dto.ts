import { StockEntity } from '../entities/stock.entity';

export class MoreAccurateAvailablityDto {
  idName: string;
  size: keyof Omit<StockEntity, 'id' | 'idName'>;
  sessionId: string;
  sessionToken?: string;
}
