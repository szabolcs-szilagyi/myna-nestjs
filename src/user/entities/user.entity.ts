import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  /**
   * WARNING: it will not be the real e-mail of the user, we strip all the
   * special characters from it and trim it to 127 character length.
   */
  @Column('varchar', { length: 128 })
  email: string;

  @Column('varchar', { name: 'firstname', length: 128 })
  firstName: string;

  @Column('varchar', { name: 'lastname', length: 128 })
  lastName: string;

  @Column({ type: 'timestamptz', name: 'lastlogin' })
  lastLogin: Date;

  @Column('date')
  birthday: Date;
}
