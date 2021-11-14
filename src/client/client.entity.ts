import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class ClientEntity {
  @PrimaryColumn()
  sid: string;

  @Column()
  email: string;

  @Column({ length: 128 })
  firstname: string;

  @Column({ length: 128 })
  lastname: string;

  @Column()
  address_line_1: string;

  @Column()
  address_line_2: string;

  @Column()
  city: string;

  @Column()
  county: string;

  @Column()
  country: string;

  @Column({ length: 128 })
  postal_code: string;

  @Column({ length: 128 })
  mobile: string;

  @Column({ length: 1024 })
  comment: string;
}
