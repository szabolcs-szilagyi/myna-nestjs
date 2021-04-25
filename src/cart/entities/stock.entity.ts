import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity({ name: 'stock' })
export class StockEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { name: 'idname', length: 128 })
  idName: string;

  @Column('int')
  xs: number;

  @Column('int')
  s: number;

  @Column('int')
  m: number;

  @Column('int')
  ml: number;

  @Column('int')
  l: number;

  @Column('int', { name: 'one_size' })
  oneSize: number;
}
