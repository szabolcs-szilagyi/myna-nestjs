import { CartEntity } from '../cart/entities/cart.entity';
import { Column, Entity, Index, OneToMany } from 'typeorm';
import { SessionEntity } from 'typeorm-store';

@Entity()
export class Session implements SessionEntity {
  @Column({ primary: true })
  id: string;

  @Column()
  @Index('IDX_session_expire')
  expiresAt: number;

  @Column()
  data: string;

  @OneToMany(() => CartEntity, (cart) => cart.session)
  carts: CartEntity[];

  setFieldInData(field: string, value: any): void {
    this.data = JSON.stringify(
      Object.assign(JSON.parse(this.data), { [field]: value }),
    );
  }
}
