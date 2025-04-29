import { Entity, Column, DeleteDateColumn, ManyToOne } from 'typeorm';
import { User } from '.';
import { AbstractEntity } from 'src/core/database';

@Entity('user_role')
export class UserRole extends AbstractEntity{

  @Column()
  userId: string;

  @Column()
  role_id: string;

  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deletedAt: Date;

  @ManyToOne(() => User, user => user.userRoles)
  user: User;
}