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

  @Get()
  @ApiOperation({ summary: 'Get all BVN data' })
  @ApiResponse({ status: 200, description: 'BVN data retrieved successfully', type: [BvnDataResponseDto] })
  async findAll(): Promise<BvnDataResponseDto[]> {
    return this.bvnDataService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get BVN data by id' })
  @ApiResponse({ status: 200, description: 'BVN data retrieved successfully', type: BvnDataResponseDto })
  async findOne(@Param('id') id: string): Promise<BvnDataResponseDto> {
    return this.bvnDataService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update BVN data' })
  @ApiResponse({ status: 200, description: 'BVN data updated successfully', type: BvnDataResponseDto })
  async update(@Param('id') id: string, @Body() updateBvnDataDto: UpdateBvnDataDto): Promise<BvnDataResponseDto> {
    return this.bvnDataService.update(id, updateBvnDataDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete BVN data' })
  @ApiResponse({ status: 200, description: 'BVN data deleted successfully' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.bvnDataService.remove(id);
  }
} 