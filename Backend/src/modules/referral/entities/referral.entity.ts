import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { AbstractEntity } from '../../../core/database';
import { User } from '../../user/entities/user.entity';

@Entity({ name: 'referrals' })
export class Referral extends AbstractEntity {
  @Column({ unique: true })
  code: string;

  @ManyToOne(() => User, user => user.referrals, { eager: true })
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @ManyToOne(() => User, user => user.referred, { nullable: true, eager: true })
  @JoinColumn({ name: 'referrer_id' })
  referrer: User;
} 