import { EntityRepository, Repository } from 'typeorm';
import { MoreAccurateAvailablityDto } from './dto/more-accurate-availablity.dto';
import { CartEntity } from './entities/cart.entity';

@EntityRepository(CartEntity)
export class CartRepository extends Repository<CartEntity> {
  /**
   * WARNING: return non paid items only
   */
  async getProductsInCart(
    sessionToken: string | null,
    sessionId: string | null,
  ): Promise<CartEntity[]> {
    let products: CartEntity[];
    if (sessionId) {
      products = await this.find({
        where: { session: sessionId, paid: false },
        order: { id: 'ASC' },
      });
    } else {
      products = await this.find({
        where: { sessionToken, paid: false },
        order: { id: 'ASC' },
      });
    }

    return products;
  }

  async setProductPaid(product: CartEntity): Promise<void> {
    await this.update({ id: product.id }, { paid: true });
  }

  getProductReservation(
    moreAccurateAvailablityDto: MoreAccurateAvailablityDto,
  ) {
    const {
      sessionToken,
      sessionId,
      idName,
      size,
    } = moreAccurateAvailablityDto;
    if (sessionToken) {
      return this.find({
        sessionToken,
        idName,
        size: size === 'oneSize' ? 'onesize' : size,
      });
    } else {
      return this.find({
        session: sessionId,
        idName,
        size: size === 'oneSize' ? 'onesize' : size,
      });
    }
  }

  getItemsWithDetails(sessionToken: string, sessionId: string, filter: any) {
    if (sessionToken) {
      return this.find({
        where: { ...filter, sessionToken },
        relations: ['product'],
      });
    } else {
      return this.find({
        where: { ...filter, session: sessionId },
        relations: ['product'],
      });
    }
  }
}
