import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  Patch,
  Query,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { NotificationService } from '../services/notification.service';
import { CreateNotificationDto } from '../dto/create-notification.dto';
import { JwtAuthGuard } from '../../../core/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../../core/decorators/roles.decorator';
import { USER_ROLE } from '../../../core/constants';
import { UpdateNotificationDto } from '../dto/update-notification.dto';

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  // @Roles([USER_ROLE.ADMIN])
  @ApiOperation({ summary: 'Create and send a notification' })
  @ApiResponse({ status: 201, description: 'Notification created and sent successfully' })
  async createNotification(@Body() dto: CreateNotificationDto) {
    return await this.notificationService.createNotification(dto);
  }

  @Post('send-to-user/:userId')
  // @Roles([USER_ROLE.ADMIN])
  @ApiOperation({ summary: 'Send notification to a specific user' })
  @ApiResponse({ status: 200, description: 'Notification sent successfully' })
  async sendNotificationToUser(
    @Param('userId') userId: string,
    @Body() dto: CreateNotificationDto,
  ) {
    return await this.notificationService.sendNotificationToUser(userId, dto);
  }

  @Post('send-to-all')
  // @Roles([USER_ROLE.ADMIN])
  @ApiOperation({ summary: 'Send notification to all users' })
  @ApiResponse({ status: 200, description: 'Notifications sent successfully' })
  async sendNotificationToAllUsers(@Body() dto: CreateNotificationDto) {
    return await this.notificationService.sendNotificationToAllUsers(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/:userId')
  @ApiOperation({ summary: 'Get notifications for a specific user' })
  @ApiResponse({ status: 200, description: 'Returns user notifications' })
  async getUserNotifications(@Param('userId') userId: string) {
    return await this.notificationService.getUserNotifications(userId);
  }

  @Patch('user/:userId/read-all')
  @ApiOperation({ summary: 'Mark all notifications as read for a user' })
  @ApiResponse({ status: 200, description: 'All notifications marked as read' })
  async markAllNotificationsAsRead(@Param('userId') userId: string) {
    await this.notificationService.markAllNotificationsAsRead(userId);
    return { message: 'All notifications marked as read' };
  }

  @Get()
  @ApiOperation({ summary: 'Get all notifications' })
  @ApiResponse({ status: 200, description: 'Returns all notifications' })
  async getAllNotifications(@Query() query: any) {
    return await this.notificationService.getAllNotifications(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a notification by ID' })
  @ApiResponse({ status: 200, description: 'Returns the notification' })
  async getNotification(@Param('id') id: string) {
    return await this.notificationService.getNotification(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a notification' })
  @ApiResponse({ status: 200, description: 'Notification updated' })
  async updateNotification(@Param('id') id: string, @Body() dto: UpdateNotificationDto) {
    return await this.notificationService.updateNotification(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a notification' })
  @ApiResponse({ status: 200, description: 'Notification deleted' })
  async deleteNotification(@Param('id') id: string) {
    await this.notificationService.deleteNotification(id);
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark a notification as read' })
  @ApiResponse({ status: 200, description: 'Notification marked as read' })
  async markNotificationAsRead(@Param('id') id: string) {
    await this.notificationService.markNotificationAsRead(id);
    return { message: 'Notification marked as read' };
  }
} 