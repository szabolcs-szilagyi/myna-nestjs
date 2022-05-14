import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'stock' })
export class StockEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column('varchar', { name: 'idname', length: 128 })
  @Index('idx_10749695_idname', { unique: true })
  idName: string;

  @Column('int4', { nullable: true, default: 0 })
  xs: number;

  @Column('int4', { nullable: true, default: 0 })
  s: number;

  @Column('int4', { nullable: true, default: 0 })
  m: number;

  @Column('int4', { nullable: true, default: 0 })
  ml: number;

  @Column('int4', { nullable: true, default: 0 })
  l: number;

  @Column('int', { name: 'one_size', nullable: true })
  oneSize: number;
}
