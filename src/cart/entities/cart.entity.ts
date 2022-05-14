import { Expose } from 'class-transformer';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductEntity } from '../../product/entities/product.entity';
import { Session } from '../../session/session.entity';

@Entity({ name: 'cart' })
export class CartEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Expose()
  @Column('varchar', { name: 'idname', length: 128 })
  idName: string;

  @Expose()
  @Column('varchar', { length: 8 })
  size: string;

  @Column('varchar', { name: 'session_token', length: 32 })
  sessionToken: string;

  @Expose()
  @Column('int2')
  amount: number;

  @Column('boolean')
  paid: boolean;

  @Column('varchar', { nullable: true })
  session: string;

  @ManyToOne(() => Session, (session) => session.carts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'session' })
  sessionData: Session;

  @ManyToOne(() => ProductEntity, (product) => product.cartItems)
  @JoinColumn({ name: 'idname', referencedColumnName: 'idName' })
  product: ProductEntity;
}
