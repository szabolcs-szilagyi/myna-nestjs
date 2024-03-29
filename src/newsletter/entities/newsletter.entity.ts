import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'newsletter' })
export class NewsletterEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column('varchar', { length: 128 })
  email: string;

  @Column('varchar', { length: 32 })
  token: string;

  @Column('date', { name: 'subscribe_date' })
  subscribeDate: Date;

  @Column('boolean')
  enabled: boolean;
}
