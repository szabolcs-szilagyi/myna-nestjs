import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'purchase_log' })
export class PurchaseLogEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'creation_time',
    type: 'timestamptz',
    default: () => 'NOW()',
    nullable: true,
  })
  creationTime: Date;

  @Column({ name: 'log_data', type: 'json' })
  logData: Record<string, unknown>;
}
