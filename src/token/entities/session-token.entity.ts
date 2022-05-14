import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'session_token',
})
export class SessionToken {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column('varchar', { length: 128 })
  email: string;

  @Column('varchar', { length: 32, name: 'session_token' })
  sessionToken: string;

  @Column({ type: 'timestamptz', name: 'create_time' })
  createTime: Date;
}
