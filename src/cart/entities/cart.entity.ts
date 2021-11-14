import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductEntity } from '../../product/entities/product.entity';

@Entity({ name: 'cart' })
export class CartEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { name: 'idname' })
  idName: string;

  @Column('varchar')
  size: string;

  @Column('varchar', { name: 'session_token' })
  sessionToken: string;

  @Column('int')
  amount: number;

  @Column('boolean')
  paid: boolean;

  @Column()
  session: string;

  @ManyToOne(() => ProductEntity, (product) => product.cartItems)
  @JoinColumn({ name: 'idname', referencedColumnName: 'idName' })
  product: ProductEntity;
}
