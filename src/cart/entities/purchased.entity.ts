import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'purchased' })
export class PurchasedEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 128 })
  email: string;

  @Column('varchar', { name: 'session_token', length: 32 })
  sessionToken: string;

  @Column('datetime')
  time: Date;
}
