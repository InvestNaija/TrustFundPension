import { Entity, Column, DeleteDateColumn, OneToMany } from 'typeorm';
import { User, UserRole} from '.';
import { AbstractEntity } from 'src/core/database';

@Entity('roles')
export class Role extends AbstractEntity{

  @Column()
  name: string;

  @Column()
  description: string;

  @DeleteDateColumn({ type: 'timestamptz', nullable: true, name: 'deleted_at' })
  deletedAt: Date;

  @OneToMany(() => UserRole, ur => ur.role)
  userRoles: UserRole[];
}