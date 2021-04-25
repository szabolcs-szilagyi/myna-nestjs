import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * WARNING: it will not be the real e-mail of the user, we strip all the
   * special characters from it and trim it to 127 character length.
   */
  @Column('varchar')
  email: string;

  @Column('varchar', { name: 'firstname' })
  firstName: string;

  @Column('varchar', { name: 'lastname' })
  lastName: string;

  @Column('timestamp', { name: 'lastlogin' })
  lastLogin: Date;

  @Column('date')
  birthday: Date;
}
