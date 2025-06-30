import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BvnDataService } from '../services';
import { CreateBvnDataDto, UpdateBvnDataDto, BvnDataResponseDto } from '../dto';
import { JwtAuthGuard } from '../../../core/auth/guards/jwt-auth.guard';
import { AdminAuthGuard } from '../../../core/auth/guards/admin-auth.guard';
import { AuthenticatedUser } from '../../../core/decorators';
import { IDecodedJwtToken } from '../../../modules/auth/strategies/types';

@ApiTags('BVN Data')
@Controller('bvn-data')
@UseGuards(JwtAuthGuard)
export class BvnDataController {
  constructor(private readonly bvnDataService: BvnDataService) {}

  @Post()
  @ApiOperation({ summary: 'Create BVN data' })
  @ApiResponse({ status: 201, description: 'BVN data created successfully', type: BvnDataResponseDto })
  async create(
    @AuthenticatedUser() authenticatedUser: IDecodedJwtToken,
    @Body() createBvnDataDto: CreateBvnDataDto
  ): Promise<BvnDataResponseDto> {
    return this.bvnDataService.create({
      ...createBvnDataDto,
      userId: authenticatedUser.id
    });
  }

  @Get('')
  @ApiOperation({ summary: 'Get current user\'s BVN data' })
  @ApiResponse({ status: 200, description: 'BVN data retrieved successfully', type: BvnDataResponseDto })
  async findOne(@AuthenticatedUser() authenticatedUser: IDecodedJwtToken): Promise<BvnDataResponseDto | { status: string, message: string, data: any }> {
    const bvnData = await this.bvnDataService.findOne(authenticatedUser.id);
    if (!bvnData) {
      throw new NotFoundException('BVN data not found');
    }
    return bvnData;
  }

  @Get('/admin/:userId')
  @UseGuards(JwtAuthGuard, AdminAuthGuard)
  @ApiOperation({ summary: 'Get BVN data by userid' })
  @ApiResponse({ status: 200, description: 'BVN data retrieved successfully', type: BvnDataResponseDto })
  async findOneById(@Param('userId') userId: string): Promise<BvnDataResponseDto | { status: string, message: string, data: any }> {
    const bvnData = await this.bvnDataService.findOne(userId);
    if (!bvnData) {
      throw new NotFoundException('BVN data not found');
    }
    return bvnData;
  }
} 