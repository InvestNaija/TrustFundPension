import { Column, Entity, DeleteDateColumn, ManyToOne } from 'typeorm';
import { User } from '.';
import { AbstractEntity } from 'src/core/database';

@Entity('nok')
export class Nok extends AbstractEntity {
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

  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deletedAt: Date;

  @ManyToOne(() => User, user => user.noks)
  user: User;
}