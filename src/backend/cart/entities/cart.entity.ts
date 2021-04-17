import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "../../product/entities/product.entity";

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

  @Column('tinyint')
  amount: number;

  @Column('tinyint')
  paid: number;

  @ManyToOne(type => Product, product => product.cartItems)
  @JoinColumn({ name: 'idname', referencedColumnName: 'idName' })
  product: Product;
}
