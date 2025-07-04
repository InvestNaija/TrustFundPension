import { Controller, Post, Get, Body, Req, UseGuards, Patch, Param, Delete } from '@nestjs/common';
import { ReferralService } from '../services';
import { CreateReferralDto, UpdateReferralDto } from '../dto';
import { JwtAuthGuard } from '../../../core/auth/guards/jwt-auth.guard';
import { AdminAuthGuard } from '../../../core/auth/guards/admin-auth.guard';
import { AuthenticatedUser } from '../../../core/decorators';
import { IDecodedJwtToken } from '../../../modules/auth/strategies/types';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Referral } from '../entities/referral.entity';

@ApiTags('Referrals')
@ApiBearerAuth()
@Controller('referrals')
export class ReferralController {
  constructor(private readonly referralService: ReferralService) {}

  @ApiOperation({ summary: 'Generate a new referral code for authenticated user' })
  @ApiResponse({ status: 201, description: 'Referral code generated successfully', type: Referral })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(JwtAuthGuard)
  @Post('generate')
  generateReferralCode(@AuthenticatedUser() authenticatedUser: IDecodedJwtToken) {
    return this.referralService.generateAndCreateReferral(authenticatedUser.id);
  }

  @ApiOperation({ summary: 'Get referral code for authenticated user' })
  @ApiResponse({ status: 200, description: 'Return user referral code', type: Referral })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(JwtAuthGuard)
  @Get('my-code')
  getMyReferralCode(@AuthenticatedUser() authenticatedUser: IDecodedJwtToken) {
    return this.referralService.getUserReferralCode(authenticatedUser.id);
  }

  @ApiOperation({ summary: 'Create new referral' })
  @ApiResponse({ status: 201, description: 'Referral created successfully', type: Referral })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@AuthenticatedUser() authenticatedUser: IDecodedJwtToken, @Body() createReferralDto: CreateReferralDto) {
    return this.referralService.create({
      ...createReferralDto,
      owner: authenticatedUser.id
    });
  }

  @ApiOperation({ summary: 'Get all referrals for authenticated user' })
  @ApiResponse({ status: 200, description: 'Return all referrals', type: [Referral] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@AuthenticatedUser() authenticatedUser: IDecodedJwtToken) {
    return this.referralService.findAll(authenticatedUser.id);
  }

  @ApiOperation({ summary: 'Get all referrals for a specific user' })
  @ApiResponse({ status: 200, description: 'Return all referrals for a specific user', type: [Referral] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(JwtAuthGuard, AdminAuthGuard)
  @Get('admin/:userId')
  findAllByUserId(@Param('userId') userId: string) {
    return this.referralService.findAll(userId);
  } 

  @ApiOperation({ summary: 'Get referral by refferal code' })
  @ApiResponse({ status: 200, description: 'Return referral by ID', type: Referral })
  @ApiResponse({ status: 404, description: 'Referral not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get(':code')
  findOne(@Param('code') code: string) {
    return this.referralService.findOne(code);
  }

  @ApiOperation({ summary: 'Update referral by ID' })
  @ApiResponse({ status: 200, description: 'Referral updated successfully', type: Referral })
  @ApiResponse({ status: 404, description: 'Referral not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReferralDto: UpdateReferralDto, @AuthenticatedUser() authenticatedUser: IDecodedJwtToken) {
    return this.referralService.update(id, updateReferralDto, authenticatedUser.id);
  }

  @ApiOperation({ summary: 'Delete referral by ID' })
  @ApiResponse({ status: 200, description: 'Referral deleted successfully' })
  @ApiResponse({ status: 404, description: 'Referral not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(JwtAuthGuard, AdminAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @AuthenticatedUser() authenticatedUser: IDecodedJwtToken) {
    return this.referralService.remove(id, authenticatedUser.id);
  }
} 