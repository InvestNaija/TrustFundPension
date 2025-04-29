import { Column, Entity, DeleteDateColumn, ManyToOne } from 'typeorm';
import { User } from '.';
import { AbstractEntity } from 'src/core/database';

@Entity('employers')
export class Employer extends AbstractEntity {
  @Column()
  userId: string;

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

  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deletedAt: Date;

  @ManyToOne(() => User, user => user.employers)
  user: User;
}