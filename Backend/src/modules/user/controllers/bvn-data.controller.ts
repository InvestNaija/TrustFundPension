import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BvnDataService } from '../services';
import { CreateBvnDataDto, UpdateBvnDataDto, BvnDataResponseDto } from '../dto';
import { JwtAuthGuard } from '../../../core/auth/guards/jwt-auth.guard';

@ApiTags('BVN Data')
@Controller('bvn-data')
@UseGuards(JwtAuthGuard)
export class BvnDataController {
  constructor(private readonly bvnDataService: BvnDataService) {}

  @Post()
  @ApiOperation({ summary: 'Create new BVN data' })
  @ApiResponse({ status: 201, description: 'BVN data created successfully', type: BvnDataResponseDto })
  async create(@Body() createBvnDataDto: CreateBvnDataDto): Promise<BvnDataResponseDto> {
    return this.bvnDataService.create(createBvnDataDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get BVN data by id' })
  @ApiResponse({ status: 200, description: 'BVN data retrieved successfully', type: BvnDataResponseDto })
  async findOne(@Param('id') id: string): Promise<BvnDataResponseDto> {
    return this.bvnDataService.findOne(id);
  }
} 