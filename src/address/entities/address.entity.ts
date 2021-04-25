import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'address' })
export class AddressEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('tinyint')
  type: number;

  @Column('varchar')
  email: string;

  @Column('varchar', { name: 'session_token' })
  sessionToken: string;

  @Column('varchar')
  name: string;

  @Column('varchar', { name: 'address_line_1' })
  addressLine1: string;

  @Column('varchar', { name: 'address_line_2' })
  addressLine2: string;

  @Column('varchar')
  city: string;

  @Column('varchar')
  state: string;

  @Column('varchar')
  zip: string;

  @Column('varchar')
  country: string;

  @Column('varchar')
  comment: string;

  @Column('varchar')
  mobile: string;
}
