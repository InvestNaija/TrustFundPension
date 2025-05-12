import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { generateOtpCodeHash } from '../../../shared/utils';
import { UserService } from '../../../modules/user/services/user.service';
import { User } from '../../../modules/user/entities';

@Injectable()
export class OtpAuthGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { otpCode, email, phone } = request.body;
    
    if (!otpCode) {
      throw new UnauthorizedException('No OTP provided');
    }

    if (!email && !phone) {
      throw new UnauthorizedException('Email or phone number is required');
    }

    // Find user by email or phone
    let user: User | null = null;
    if (email) {
      user = await this.userService.findByEmail(email);
    } else if (phone) {
      user = await this.userService.findByPhone(phone);
    }

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const otpCodeHash = generateOtpCodeHash(otpCode);
    if (otpCodeHash !== user.otpCodeHash) {
      throw new UnauthorizedException('Invalid OTP');
    }

    if (!user.otpCodeExpiry || new Date() > user.otpCodeExpiry) {
      throw new UnauthorizedException('OTP has expired');
    }
    // Update user password
    await this.userService.update(user.id, {
        otpCodeHash: null,
        otpCodeExpiry: null,
      });

    return true;
  }
} 