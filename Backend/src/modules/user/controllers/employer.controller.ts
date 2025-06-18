import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { EmployerService } from '../services';
import { CreateEmployerDto, UpdateEmployerDto, EmployerResponseDto } from '../dto';
import { JwtAuthGuard } from '../../../core/auth/guards/jwt-auth.guard';
import { AuthenticatedUser } from '../../../core/decorators';
import { IDecodedJwtToken } from '../../../modules/auth/strategies/types';

@ApiTags('Employers')
@Controller('employers')
@UseGuards(JwtAuthGuard)
export class EmployerController {
  constructor(private readonly employerService: EmployerService) {}

  @Post()
  @ApiOperation({ summary: 'Create employer' })
  @ApiResponse({ status: 201, description: 'Employer created successfully', type: EmployerResponseDto })
  async create(
    @AuthenticatedUser() authenticatedUser: IDecodedJwtToken,
    @Body() createEmployerDto: CreateEmployerDto
  ): Promise<EmployerResponseDto> {
    return this.employerService.create({
      ...createEmployerDto,
      userId: authenticatedUser.id
    });
  }

  @Get('')
  @ApiOperation({ summary: 'Get current user\'s employer details' })
  @ApiResponse({ status: 200, description: 'Employer retrieved successfully', type: EmployerResponseDto })
  async findOne(@AuthenticatedUser() authenticatedUser: IDecodedJwtToken): Promise<EmployerResponseDto | { status: string, message: string, data: any }> {
    return this.employerService.findOne(authenticatedUser.id);
  }

  @Get('/admin/:userId')
  @ApiOperation({ summary: 'Get employer details by userid' })
  @ApiResponse({ status: 200, description: 'Employer retrieved successfully', type: EmployerResponseDto })
  async findOneById(@Param('userId') userId: string): Promise<EmployerResponseDto | { status: string, message: string, data: any }> {
    return this.employerService.findOne(userId);
  }

  @Put('')
  @ApiOperation({ summary: 'Update current user\'s employer details' })
  @ApiResponse({ status: 200, description: 'Employer updated successfully', type: EmployerResponseDto })
  async update(
    @AuthenticatedUser() authenticatedUser: IDecodedJwtToken,
    @Body() updateEmployerDto: UpdateEmployerDto
  ): Promise<EmployerResponseDto> {
    return this.employerService.update(authenticatedUser.id, updateEmployerDto);
  }

  @Delete('')
  @ApiOperation({ summary: 'Delete current user\'s employer details' })
  @ApiResponse({ status: 200, description: 'Employer deleted successfully' })
  async remove(@AuthenticatedUser() authenticatedUser: IDecodedJwtToken): Promise<void> {
    return this.employerService.remove(authenticatedUser.id);
  }
} 