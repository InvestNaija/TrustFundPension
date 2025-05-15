import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { generateOtpCodeHash } from '../../../shared/utils';
import { UserService } from '../../../modules/user/services/user.service';
import { UserResponseDto } from '../../../modules/user/dto';
import { IDecodedJwtToken } from '../../../modules/auth/strategies/types';

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

    let user: UserResponseDto | null = null;

    const authenticatedUser = request.user as IDecodedJwtToken;
    if (authenticatedUser?.id) {
      user = await this.userService.findOne(authenticatedUser.id);
    } else if (email || phone) {
      if (email) {
        user = await this.userService.findByEmail(email);
      } else if (phone) {
        user = await this.userService.findByPhone(phone);
      }
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

    await this.userService.update(user.id, {
      otpCodeHash: null,
      otpCodeExpiry: null,
    });

    return true;
  }
}