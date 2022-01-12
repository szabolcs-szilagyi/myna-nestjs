import { Expose } from 'class-transformer';
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

  @Expose()
  @Column('varchar', { name: 'idname' })
  idName: string;

  @Expose()
  @Column('varchar')
  size: string;

  @Column('varchar', { name: 'session_token' })
  sessionToken: string;

  @Expose()
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
