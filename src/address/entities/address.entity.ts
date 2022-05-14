import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'address' })
export class AddressEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column('boolean')
  type: boolean;

  @Column({ type: 'varchar', length: 128 })
  email: string;

  @Column({ type: 'varchar', length: 32, name: 'session_token' })
  sessionToken: string;

  @Column({ type: 'varchar', length: 128, nullable: true })
  name?: string;

  @Column({ type: 'varchar', length: 128, name: 'address_line_1' })
  addressLine1: string;

  @Column({ type: 'varchar', length: 128, name: 'address_line_2' })
  addressLine2: string;

  @Column({ type: 'varchar', length: 128 })
  city: string;

  @Column({ type: 'varchar', length: 128 })
  state: string;

  @Column({ type: 'varchar', length: 64 })
  zip: string;

  @Column({ type: 'varchar', length: 64 })
  country: string;

  @Column({ type: 'varchar', length: 256 })
  comment: string;

  @Column({ type: 'varchar', length: 24 })
  mobile: string;
}
