import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../core/auth/guards/jwt-auth.guard';
import { AuthenticatedUser } from '../../../core/decorators';
import { IDecodedJwtToken } from '../../../modules/auth/strategies/types';
import { UserService } from '../services/user.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

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
  @ApiOperation({ summary: 'Verify BVN' })
  @ApiResponse({ status: 200, description: 'BVN verified successfully' })
  async verifyBvn(
    @Body() body: { bvn: string },
    @AuthenticatedUser() user: IDecodedJwtToken
  ) {
    await this.userService.verifyBvn(body.bvn, user.id);
    return { status: true, message: 'BVN verified successfully' };
  }

  @Get('nin/details/:nin')
  @ApiOperation({ summary: 'Get NIN details' })
  @ApiResponse({ status: 200, description: 'NIN details retrieved successfully' })
  async getNinDetails(@Param('nin') nin: string) {
    return this.userService.getNinDetails(nin);
  }

  @Post('nin/verify')
  @ApiOperation({ summary: 'Verify NIN' })
  @ApiResponse({ status: 200, description: 'NIN verified successfully' })
  async verifyNin(
    @Body() body: { nin: string },
    @AuthenticatedUser() user: IDecodedJwtToken
  ) {
    await this.userService.verifyNin(body.nin, user.id);
    return { status: true, message: 'NIN verified successfully' };
  }
} 