import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CartEntity } from '../../cart/entities/cart.entity';

type KnownColors =
  | 'Satin White'
  | 'Fresh Green'
  | 'Peach Glow'
  | 'Dusty Pink'
  | 'Dust Pink'
  | 'Summer Green'
  | 'Ocean Blue'
  | 'Light Rose'
  | 'Midnight Rose'
  | 'Satin Cream'
  | 'Shadow Sand'
  | 'Dusty Rose'
  | 'Vivid Brown'
  | 'Crimson Red'
  | 'Sunrise Yellow';

@Entity({
  name: 'products',
})
export class ProductEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 128, name: 'idname', unique: true })
  idName: string;

  @Column({ type: 'varchar', length: 64 })
  availability: string;

  @Column('boolean', { name: 'is_one_size', default: false })
  isOneSize: number;

  @Column({ type: 'varchar', length: 128, name: 'productname' })
  name: string;

  @Column({ type: 'varchar', length: 128, name: 'name_pl', nullable: true })
  namePl: string;

  @Column({ type: 'varchar', length: 128, name: 'productcolor' })
  color: KnownColors;

  @Column('smallint', { name: 'productprice' })
  price: number;

  @Column({ type: 'varchar', length: 2048, name: 'desclong' })
  description: string;

  @Column({ type: 'varchar', length: 2048, name: 'desc_pl', nullable: true })
  descriptionPl: string;

  @Column({ type: 'varchar', length: 2048, name: 'comp_care' })
  compCare: string;

  @Column({
    type: 'varchar',
    length: 2048,
    name: 'composition_and_care_pl',
    nullable: true,
  })
  compositionAndCarePl: string;

  @Column({ type: 'varchar', length: 256, nullable: true })
  pic1: string;

  @Column({ type: 'varchar', length: 256, nullable: true })
  pic2: string;

  @Column({ type: 'varchar', length: 256, nullable: true })
  pic3: string;

  @Column({ type: 'varchar', length: 256, nullable: true })
  pic4: string;

  @Column({ type: 'varchar', length: 256, nullable: true })
  pic5: string;

  @Column({ type: 'varchar', length: 256, nullable: true })
  pic6: string;

  @Column({ type: 'varchar', length: 256, nullable: true })
  pic7: string;

  @Column({ type: 'varchar', length: 256, nullable: true })
  pic8: string;

  @Column({ type: 'varchar', length: 256, nullable: true })
  pic9: string;

  @OneToMany(() => CartEntity, (cartItems) => cartItems.idName)
  cartItems: CartEntity[];
}
