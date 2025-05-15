import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../core/auth/guards/jwt-auth.guard';
import { AuthenticatedUser } from '../../../core/decorators';
import { IDecodedJwtToken } from '../../../modules/auth/strategies/types';
import { UserService } from '../services/user.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { OtpAuthGuard } from '../../../core/auth/guards/otp.guard';
import { VerifyBvnDto, VerifyNinDto } from '../dto';

@ApiTags('Verification')
@Controller('verification')
@UseGuards(JwtAuthGuard)
export class VerificationController {
  constructor(private readonly userService: UserService) {}

  @Post('bvn/details')
  @ApiOperation({ summary: 'Get BVN details' })
  @ApiResponse({ status: 200, description: 'BVN details retrieved successfully' })
  async getBvnDetails(
    @Body() body: { bvn: string; firstName: string; lastName: string },
    @AuthenticatedUser() user: IDecodedJwtToken
  ) {
    return this.userService.getBvnDetails(body.bvn, body.firstName, body.lastName, user.id);
  }

  @Post('bvn/verify')
  @UseGuards(OtpAuthGuard)
  @ApiOperation({ summary: 'Verify BVN' })
  @ApiResponse({ status: 200, description: 'BVN verified successfully' })
  async verifyBvn(
    @Body() dto: VerifyBvnDto,
    @AuthenticatedUser() user: IDecodedJwtToken
  ) {
    await this.userService.verifyBvn(dto.bvn, user.id);
    return { status: true, message: 'BVN verified successfully' };
  }

  @Get('nin/details/:nin')
  @ApiOperation({ summary: 'Get NIN details' })
  @ApiResponse({ status: 200, description: 'NIN details retrieved successfully' })
  async getNinDetails(@Param('nin') nin: string) {
    return this.userService.getNinDetails(nin);
  }

  @Post('nin/verify')
  @UseGuards(OtpAuthGuard)
  @ApiOperation({ summary: 'Verify NIN' })
  @ApiResponse({ status: 200, description: 'NIN verified successfully' })
  async verifyNin(
    @Body() dto: VerifyNinDto,
    @AuthenticatedUser() user: IDecodedJwtToken
  ) {
    await this.userService.verifyNin(dto.nin, user.id);
    return { status: true, message: 'NIN verified successfully' };
  }
} 