import { Entity, Column, DeleteDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { AbstractEntity } from 'src/core/database';
import { Address } from './address.entity';
import { User } from './user.entity';

@Entity('employers')
export class Employer extends AbstractEntity {
  @Column()
  name: string;

  @Column({ type: 'uuid', name: 'user_id' })
  userId: string;

  @Column({ name: 'rc_number' })
  rcNumber: string;

  @Column({ name: 'phone_number' })
  phoneNumber: string;

  @Column({ name: 'initial_date' })
  initialDate: Date;

  @Column({ name: 'current_date' })
  currentDate: Date;

  @Column({ name: 'nature_of_business' })
  natureOfBusiness: string;

  @OneToMany(() => Address, address => address.commonId)
  addresses: Address[];

  @DeleteDateColumn({ type: 'timestamptz', nullable: true, name: 'deleted_at' })
  deletedAt: Date;

  @ManyToOne(() => User, user => user.employers)
  @JoinColumn({ name: 'user_id' })
  user: User;
}