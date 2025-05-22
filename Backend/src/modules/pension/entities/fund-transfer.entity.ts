import { Column, Entity, ManyToOne, JoinColumn, DeleteDateColumn } from 'typeorm';
import { AbstractEntity } from 'src/core/database';
import { User } from '../../user/entities/user.entity';

@Entity({ name: 'fund_transfers' })
export class FundTransfer extends AbstractEntity {
  @Column({ type: 'uuid', name: 'user_id' })
  userId: string;

  @Column({ name: 'current_fund' })
  currentFund: string;

  @Column({ name: 'aspiring_fund' })
  aspiringFund: string;

  @Column({ name: 'is_approved', default: false })
  isApproved: boolean;

  @Column({ name: 'approval_date', nullable: true })
  approvalDate: Date;

  @Column({ name: 'rejection_reason', nullable: true })
  rejectionReason: string;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  deletedAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
} 