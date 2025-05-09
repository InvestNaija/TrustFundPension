import { Column, Entity, DeleteDateColumn, ManyToOne } from 'typeorm';
import { User } from '.';
import { AbstractEntity } from 'src/core/database';

@Entity('nok')
export class Nok extends AbstractEntity {
  @Column()
  userId: string;

  @Column()
  title: string;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ nullable: true, name: 'other_name' })
  otherName: string;

  @Column()
  surname: string;

  @Column()
  gender: string;

  @Column()
  phone: string;

  @DeleteDateColumn({ type: 'timestamptz', nullable: true, name: 'deleted_at' })
  deletedAt: Date;

  @ManyToOne(() => User, user => user.noks)
  user: User;
}