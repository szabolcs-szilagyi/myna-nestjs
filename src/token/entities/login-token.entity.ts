import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'login_token',
})
export class LoginToken {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column('varchar', { length: 128 })
  email: string;

  @Column('varchar', { length: 32, name: 'login_token' })
  loginToken: string;

  @Column({ type: 'timestamptz', name: 'create_time' })
  createTime: Date;
}
