import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn, DeleteDateColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { AbstractEntity } from 'src/core/database/abstract.entity';

export enum NotificationType {
  SYSTEM = 'SYSTEM',
  TRANSACTION = 'TRANSACTION',
  SECURITY = 'SECURITY',
  MARKETING = 'MARKETING',
}

export enum NotificationStatus {
  PENDING = 'PENDING',
  SENT = 'SENT',
  FAILED = 'FAILED',
}

@Entity('notifications')
export class Notification extends AbstractEntity {
  @Column()
  title: string;

  @Column('text')
  body: string;

  @Column({
    type: 'enum',
    enum: NotificationType,
    default: NotificationType.SYSTEM,
  })
  type: NotificationType;

  @Column({
    type: 'enum',
    enum: NotificationStatus,
    default: NotificationStatus.PENDING,
  })
  status: NotificationStatus;

  @ManyToOne(() => User, user => user.notifications, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ nullable: true, name: 'fcm_token' })
  fcmToken: string;

  @Column({ default: false, name: 'is_read' })
  isRead: boolean;

  @Column({ nullable: true })
  data: string;

  @DeleteDateColumn({ type: 'timestamptz', nullable: true, name: 'deleted_at' })
  deletedAt: Date;
} 