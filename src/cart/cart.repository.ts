import { EntityRepository, Repository } from "typeorm";
import { MoreAccurateAvailablityDto } from "./dto/more-accurate-availablity.dto";
import { CartEntity } from "./entities/cart.entity";

@EntityRepository(CartEntity)
export class CartRepository extends Repository<CartEntity> {
  /**
   * WARNING: return non paid items only
   */
  async getProductsInCart(sessionToken: string): Promise<CartEntity[]> {
    const products = await this.find({
      where: { sessionToken, paid: false },
      order: { id: 'ASC' },
    });

    return products;
  }

  async setProductPaid(product: CartEntity): Promise<void> {
    await this.update({ id: product.id }, { paid: true });
  }

  async getProductReservation(moreAccurateAvailablityDto: MoreAccurateAvailablityDto) {
    const { sessionToken, idName, size } = moreAccurateAvailablityDto;
    return this.find({ sessionToken, idName, size: size === 'oneSize' ? 'onesize': size })
  }

  getItemsWithDetails(sessionToken: string, filter: object) {
    return this.find({
      where: { ...filter, sessionToken },
      relations: ['product'],
    });
  }
}
