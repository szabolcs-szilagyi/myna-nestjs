import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'login_token',
})
export class LoginToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar')
  email: string;

  @Column('varchar', { name: 'login_token' })
  loginToken: string;

  @Column('timestamp', { name: 'create_time' })
  createTime: Date;
}
