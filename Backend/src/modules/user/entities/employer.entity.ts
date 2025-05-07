import { Column, Entity, DeleteDateColumn, ManyToOne } from 'typeorm';
import { User } from '.';
import { AbstractEntity } from 'src/core/database';

@Entity('employers')
export class Employer extends AbstractEntity {
  @Column({ name: 'user_id' })
  userId: string;

  @Column()
  business: string;

  @Column()
  phone: string;

  @Column()
  type: string;

  @Column()
  rcno: string;

  @Column({ type: 'date', name: 'first_appoint_date' })
  firstApointDate: string;

  @DeleteDateColumn({ type: 'timestamptz', nullable: true, name: 'deleted_at' })
  deletedAt: Date;

  @ManyToOne(() => User, user => user.employers)
  user: User;
}