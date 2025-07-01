import { IsString, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { NotificationType, NotificationStatus } from '../entities/notification.entity';

export class UpdateNotificationDto {
  @ApiProperty({ description: 'Title of the notification' })
  @IsOptional()
  @IsString()
  title: string;

  @ApiProperty({ description: 'Body/content of the notification' })
  @IsOptional()
  @IsString()
  body: string;

  @ApiProperty({ description: 'Type of notification', enum: NotificationType })
  @IsOptional()
  @IsEnum(NotificationType)
  type: NotificationType;

  @ApiProperty({ description: 'Status of notification', enum: NotificationStatus, default: NotificationStatus.PENDING })
  @IsOptional()
  @IsEnum(NotificationStatus)
  status?: NotificationStatus;

  @ApiProperty({ description: 'Additional data for the notification', required: false })
  @IsOptional()
  @IsString()
  data?: string;
} 