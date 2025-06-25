import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationStatus } from '../entities/notification.entity';
import { CreateNotificationDto } from '../dto/create-notification.dto';
import { UserService } from '../../user/services/user.service';
import * as admin from 'firebase-admin';
import { envConfig } from '../../../core/config';
import { ListUsersDto } from '../../user/dto';

@Injectable()
export class NotificationService implements OnModuleInit {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    private readonly userService: UserService,
  ) {}

  async onModuleInit() {
    try {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: envConfig.FIREBASE_PROJECT_ID,
          clientEmail: envConfig.FIREBASE_CLIENT_EMAIL,
          privateKey: envConfig.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
      });
      this.logger.log('Firebase Admin initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize Firebase Admin:', error);
    }
  }

  async createNotification(dto: CreateNotificationDto): Promise<Notification> {
    const notification = this.notificationRepository.create({
      ...dto,
      status: dto.status || NotificationStatus.PENDING,
    });
    return await this.notificationRepository.save(notification);
  }

  async sendNotification(notification: Notification): Promise<void> {
    try {
      if (!notification.fcmToken) {
        this.logger.warn(`No FCM token found for notification ${notification.id}`);
        return;
      }

      const message: admin.messaging.Message = {
        notification: {
          title: notification.title,
          body: notification.body,
        },
        token: notification.fcmToken,
        data: notification.data ? { data: notification.data } : undefined,
      };

      await admin.messaging().send(message);
      
      await this.notificationRepository.update(notification.id, {
        status: NotificationStatus.SENT,
      });
      
      this.logger.log(`Notification ${notification.id} sent successfully`);
    } catch (error) {
      this.logger.error(`Failed to send notification ${notification.id}:`, error);
      await this.notificationRepository.update(notification.id, {
        status: NotificationStatus.FAILED,
      });
      throw error;
    }
  }

  async sendNotificationToUser(userId: string, dto: CreateNotificationDto): Promise<Notification> {
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new Error(`User ${userId} not found`);
    }

    const notification = await this.createNotification({
      ...dto,
      userId,
      fcmToken: user.fcmToken,
    });

    await this.sendNotification(notification);
    return notification;
  }

  async sendNotificationToAllUsers(dto: CreateNotificationDto): Promise<void> {
    const listUsersDto = new ListUsersDto();
    listUsersDto.page = 1;
    listUsersDto.limit = 1000;
    
    const response = await this.userService.listUsers(listUsersDto);
    const users = response.data.data;
    
    const notifications = await Promise.all(
      users.map(user => 
        this.createNotification({
          ...dto,
          userId: user.id,
          fcmToken: user.fcmToken,
        })
      )
    );

    await Promise.all(notifications.map(notification => this.sendNotification(notification)));
  }

  async getUserNotifications(userId: string): Promise<Notification[]> {
    return await this.notificationRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  async markNotificationAsRead(notificationId: string): Promise<void> {
    await this.notificationRepository.update(notificationId, { isRead: true });
  }

  async markAllNotificationsAsRead(userId: string): Promise<void> {
    await this.notificationRepository.update(
      { user: { id: userId }, isRead: false },
      { isRead: true }
    );
  }
} 