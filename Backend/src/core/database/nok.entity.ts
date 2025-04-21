import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity('nok')
export class Nok {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  title: string;

  @Column()
  first_name: string;

  @Column({ nullable: true })
  other_name: string;

  @Column()
  surname: string;

  @Column()
  gender: string;

  @Column()
  phone: string;

  @ManyToOne(() => User, user => user.noks)
  user: User;
}