import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'session_token',
})
export class SessionToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar')
  email: string;

  @Column('varchar', { name: 'session_token' })
  sessionToken: string;

  @Column('timestamp', { name: 'create_time' })
  createTime: Date;
}
