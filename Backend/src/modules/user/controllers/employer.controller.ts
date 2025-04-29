import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { EmployerService } from '../services';
import { CreateEmployerDto, UpdateEmployerDto, EmployerResponseDto } from '../dto';
import { JwtAuthGuard } from '../../../core/auth/guards/jwt-auth.guard';

@ApiTags('Employers')
@Controller('employers')
@UseGuards(JwtAuthGuard)
export class EmployerController {
  constructor(private readonly employerService: EmployerService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new employer' })
  @ApiResponse({ status: 201, description: 'Employer created successfully', type: EmployerResponseDto })
  async create(@Body() createEmployerDto: CreateEmployerDto): Promise<EmployerResponseDto> {
    return this.employerService.create(createEmployerDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all employers' })
  @ApiResponse({ status: 200, description: 'Employers retrieved successfully', type: [EmployerResponseDto] })
  async findAll(): Promise<EmployerResponseDto[]> {
    return this.employerService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an employer by id' })
  @ApiResponse({ status: 200, description: 'Employer retrieved successfully', type: EmployerResponseDto })
  async findOne(@Param('id') id: string): Promise<EmployerResponseDto> {
    return this.employerService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an employer' })
  @ApiResponse({ status: 200, description: 'Employer updated successfully', type: EmployerResponseDto })
  async update(@Param('id') id: string, @Body() updateEmployerDto: UpdateEmployerDto): Promise<EmployerResponseDto> {
    return this.employerService.update(id, updateEmployerDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an employer' })
  @ApiResponse({ status: 200, description: 'Employer deleted successfully' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.employerService.remove(id);
  }
} 