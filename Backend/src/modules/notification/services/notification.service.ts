import { Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Notification, NotificationStatus } from '../entities/notification.entity';
import { CreateNotificationDto } from '../dto/create-notification.dto';
import { UserService } from '../../user/services/user.service';
import * as admin from 'firebase-admin';
import * as FCM from 'fcm-notification';
import { envConfig } from '../../../core/config';
import { ListUsersDto } from '../../user/dto';
import { UpdateNotificationDto } from '../dto/update-notification.dto';

@Injectable()
export class NotificationService implements OnModuleInit {
  private readonly logger = new Logger(NotificationService.name);
  private fcm: FCM;
  private firebaseAdmin: any;

  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    private readonly userService: UserService,
  ) {}

  async onModuleInit() {
    try {
      this.firebaseAdmin = admin.initializeApp({
        credential: admin.credential.cert({
          projectId: envConfig.FIREBASE_PROJECT_ID,
          clientEmail: envConfig.FIREBASE_CLIENT_EMAIL,
          privateKey: envConfig.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
      });
      this.fcm = new FCM({
        projectId: envConfig.FIREBASE_PROJECT_ID,
        clientEmail: envConfig.FIREBASE_CLIENT_EMAIL,
        privateKey: envConfig.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      });
      this.logger.log('Firebase Admin initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize Firebase Admin:', error);
    }
  }

  async registerFcmTokenToChannel(deviceToken: string) {
    if (!envConfig.FIREBASE_PENSION_CHANNEL) {
      throw new Error('FIREBASE_PENSION_CHANNEL environment variable is not configured');
    }
    await this.subscribeToTopic({deviceToken: deviceToken, topic: envConfig.FIREBASE_PENSION_CHANNEL});
  }

  private async subscribeToTopic({deviceToken, topic}: {deviceToken: string, topic: string}) {
    return this.fcm.subscribeToTopic([deviceToken], topic, (err, resp) => {
      if(err){
        console.log('Yayyyyyy!!', JSON.stringify(err.errors))
        return
      }else{
        console.log('Sent successfully')
      }
    })
    // return admin.messaging().subscribeToTopic(deviceToken, topic)
  }

  async createNotification(dto: CreateNotificationDto): Promise<Notification> {
    const notification = this.notificationRepository.create({
      ...dto,
      status: dto.status || NotificationStatus.PENDING,
    });
    return await this.notificationRepository.save(notification);
  }

  private sendNotificationToATopic(payload: any) {
    try {
      return this.firebaseAdmin.messaging().send({
        topic: envConfig.FIREBASE_PENSION_CHANNEL,
        ...payload
      })
    } catch (error) {
      this.logger.error('Failed to send notification to a topic:', error);
      throw error;
    }
  }
  
  async getNotification(id: string): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({ where: { id }, relations: ['user'] });
    if (!notification) {
      throw new Error(`Notification ${id} not found`);
    }
    return notification;
  }

  async getAllNotifications(query: any): Promise<{ data: Notification[], total: number }> {
    const { page = 1, limit = 10, search = '' } = query;
    const skip = (page - 1) * limit;
    const take = limit;

    const where: any = {};
    if (search) {
      where.title = ILike(`%${search}%`);
      where.body = ILike(`%${search}%`);
      where.status = search;
      where.createdAt = search;
    }

    const [notifications, total] = await this.notificationRepository.findAndCount({ relations: ['user'], skip, take, where });
    return { data: notifications, total };
  }

  async updateNotification(id: string, dto: UpdateNotificationDto): Promise<Notification> {
    try {
      const notification = await this.notificationRepository.findOne({ where: { id } });
      if (!notification) {
        throw new NotFoundException(`Notification not found`);
      }
      return await this.notificationRepository.save({ ...notification, ...dto });
    } catch (error) {
      throw error;
    }
  }

  async deleteNotification(id: string): Promise<void> {
    await this.notificationRepository.softDelete(id);
  }

  async sendNotification(notification: Notification): Promise<void> {
    try {
      if (!notification.fcmToken) {
        this.logger.warn(`No FCM token found for notification ${notification.id}`);
        return;
      }

      const message: any = {
        notification: {
          title: notification.title,
          body: notification.body,
        },
        data: notification.data ? { data: notification.data } : undefined,
      };

      await this.sendNotificationToATopic(message);
      
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