import { Injectable, Logger } from '@nestjs/common';
import { UserService } from './user.service';

@Injectable()
export class VerificationService {
  private readonly logger = new Logger(VerificationService.name);

  constructor(private readonly userService: UserService) {}

  async updateNinVerification(userId: string, nin: string) {
    try {
      await this.userService.updateVerificationData(userId, { nin });
    } catch (error) {
      this.logger.error('Error updating NIN verification:', error);
      throw error;
    }
  }

  async updateBvnVerification(userId: string, bvn: string) {
    try {
      await this.userService.updateVerificationData(userId, { bvn });
    } catch (error) {
      this.logger.error('Error updating BVN verification:', error);
      throw error;
    }
  }
} 