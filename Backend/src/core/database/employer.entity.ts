import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity('employer')
export class Employer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  business: string;

  @Column()
  phone: string;

  @Column()
  type: string;

  @Column()
  rcno: string;

  @Column({ type: 'date' })
  first_appoint_date: string;

  @ManyToOne(() => User, user => user.employers)
  user: User;
}