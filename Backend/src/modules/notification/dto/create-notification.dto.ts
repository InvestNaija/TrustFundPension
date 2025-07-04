import { IsString, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { NotificationType, NotificationStatus } from '../entities/notification.entity';

export class CreateNotificationDto {
  @ApiProperty({ description: 'Title of the notification' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Body/content of the notification' })
  @IsString()
  body: string;

  @ApiProperty({ description: 'Type of notification', enum: NotificationType })
  @IsEnum(NotificationType)
  type: NotificationType;

  @ApiProperty({ description: 'Status of notification', enum: NotificationStatus, default: NotificationStatus.PENDING })
  @IsOptional()
  @IsEnum(NotificationStatus)
  status?: NotificationStatus;

  @ApiProperty({ description: 'User ID to send notification to', required: false })
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiProperty({ description: 'FCM token for push notification', required: false })
  @IsOptional()
  @IsString()
  fcmToken?: string;

  @ApiProperty({ description: 'Additional data for the notification', required: false })
  @IsOptional()
  @IsString()
  data?: string;
} 