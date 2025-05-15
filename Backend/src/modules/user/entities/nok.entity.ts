import { Column, Entity, DeleteDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { AbstractEntity } from 'src/core/database';
import { Address } from './address.entity';
import { User } from './user.entity';

@Entity({ name: 'noks' })
export class Nok extends AbstractEntity {
  @Column({ type: 'uuid', name: 'user_id' })
  userId: string;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ nullable: true, name: 'middle_name' })
  middleName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column()
  gender: string;

  @Column()
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column()
  relationship: string;

  @DeleteDateColumn({ type: 'timestamptz', nullable: true, name: 'deleted_at' })
  deletedAt: Date;

  @OneToMany(() => Address, address => address.nok, { eager: true })
  addresses: Address[];

  @ManyToOne(() => User, user => user.noks)
  @JoinColumn({ name: 'user_id' })
  user: User;
}