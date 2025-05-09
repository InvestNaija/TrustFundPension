import { Entity, Column, DeleteDateColumn, ManyToOne } from 'typeorm';
import { User } from '.';
import { AbstractEntity } from 'src/core/database';

@Entity('user_role')
export class UserRole extends AbstractEntity{

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'role_id' })
  roleId: string;

  @DeleteDateColumn({ type: 'timestamptz', nullable: true, name: 'deleted_at' })
  deletedAt: Date;

  @ManyToOne(() => User, user => user.userRoles)
  user: User;
}