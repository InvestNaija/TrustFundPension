import { Controller, Post, Get, Body, Req, UseGuards, Patch, Param, Delete } from '@nestjs/common';
import { ReferralService } from '../services';
import { CreateReferralDto, UpdateReferralDto } from '../dto';
import { JwtAuthGuard } from '../../../core/auth/guards/jwt-auth.guard';
import { AuthenticatedUser } from '../../../core/decorators';
import { IDecodedJwtToken } from '../../../modules/auth/strategies/types';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Referral } from '../entities/referral.entity';

@ApiTags('Referrals')
@ApiBearerAuth()
@Controller('referrals')
@UseGuards(JwtAuthGuard)
export class ReferralController {
  constructor(private readonly referralService: ReferralService) {}

  @ApiOperation({ summary: 'Create new referral' })
  @ApiResponse({ status: 201, description: 'Referral created successfully', type: Referral })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
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
  @Get()
  findAll(@AuthenticatedUser() authenticatedUser: IDecodedJwtToken) {
    return this.referralService.findAll(authenticatedUser.id);
  }

  @ApiOperation({ summary: 'Get referral by ID' })
  @ApiResponse({ status: 200, description: 'Return referral by ID', type: Referral })
  @ApiResponse({ status: 404, description: 'Referral not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.referralService.findOne(id);
  }

  @ApiOperation({ summary: 'Update referral by ID' })
  @ApiResponse({ status: 200, description: 'Referral updated successfully', type: Referral })
  @ApiResponse({ status: 404, description: 'Referral not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReferralDto: UpdateReferralDto, @AuthenticatedUser() authenticatedUser: IDecodedJwtToken) {
    return this.referralService.update(id, updateReferralDto, authenticatedUser.id);
  }

  @ApiOperation({ summary: 'Delete referral by ID' })
  @ApiResponse({ status: 200, description: 'Referral deleted successfully' })
  @ApiResponse({ status: 404, description: 'Referral not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Delete(':id')
  remove(@Param('id') id: string, @AuthenticatedUser() authenticatedUser: IDecodedJwtToken) {
    return this.referralService.remove(id, authenticatedUser.id);
  }
} 