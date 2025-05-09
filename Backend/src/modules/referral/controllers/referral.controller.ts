import { Controller, Post, Get, Body, Req, UseGuards } from '@nestjs/common';
import { ReferralService } from '../services/referral.service';
import { CreateReferralDto } from '../dto/create-referral.dto';
import { JwtAuthGuard } from '../../../core/auth/guards/jwt-auth.guard';
import { AuthenticatedUser } from '../../../core/decorators';
import { IDecodedJwtToken } from '../../../core/decorators';

@Controller('referral')
export class ReferralController {
  constructor(private readonly referralService: ReferralService) {}

  @Post('generate')
  @UseGuards(JwtAuthGuard)
  async generate(@Req() req, @Body() dto: Partial<CreateReferralDto>, @AuthenticatedUser() authenticatedUser: IDecodedJwtToken) {
    return this.referralService.generateCode({ ...dto, ownerId: authenticatedUser.id });
  }

  @Get('my-code')
  @UseGuards(JwtAuthGuard)
  async getMyCode(@Req() req,  @AuthenticatedUser() authenticatedUser: IDecodedJwtToken) {
    return this.referralService.getMyReferralCode(authenticatedUser.id);
  }
} 