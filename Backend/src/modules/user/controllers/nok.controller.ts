import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { NokService } from '../services';
import { CreateNokDto, UpdateNokDto, NokResponseDto } from '../dto';
import { JwtAuthGuard } from '../../../core/auth/guards/jwt-auth.guard';
import { AdminAuthGuard } from '../../../core/auth/guards/admin-auth.guard';
import { AuthenticatedUser } from '../../../core/decorators';
import { IDecodedJwtToken } from '../../../modules/auth/strategies/types';

@ApiTags('Next of Kin')
@Controller('noks')
@UseGuards(JwtAuthGuard)
export class NokController {
  constructor(private readonly nokService: NokService) {}

  @Post()
  @ApiOperation({ summary: 'Create next of kin' })
  @ApiResponse({ status: 201, description: 'Next of kin created successfully', type: NokResponseDto })
  async create(
    @AuthenticatedUser() authenticatedUser: IDecodedJwtToken,
    @Body() createNokDto: CreateNokDto
  ): Promise<NokResponseDto> {
    return this.nokService.create({
      userId: authenticatedUser.id,
      ...createNokDto
    });
  }

  @Get('')
  @ApiOperation({ summary: 'Get current user\'s next of kin' })
  @ApiResponse({ status: 200, description: 'Next of kin retrieved successfully', type: NokResponseDto })
  async findOne(@AuthenticatedUser() authenticatedUser: IDecodedJwtToken): Promise<NokResponseDto | { status: string, message: string, data: any }> {
    return this.nokService.findOne(authenticatedUser.id);
  }

  @Get('/admin/:userId')
  @ApiOperation({ summary: 'Get next of kin details by userid' })
  @ApiResponse({ status: 200, description: 'Next of kin retrieved successfully', type: NokResponseDto })
  async findOneById(@Param('userId') userId: string): Promise<NokResponseDto | { status: string, message: string, data: any }> {
    return this.nokService.findOne(userId);
  } 

  @Put('')
  @ApiOperation({ summary: 'Update current user\'s next of kin' })
  @ApiResponse({ status: 200, description: 'Next of kin updated successfully', type: NokResponseDto })
  async update(
    @AuthenticatedUser() authenticatedUser: IDecodedJwtToken,
    @Body() updateNokDto: UpdateNokDto
  ): Promise<NokResponseDto> {
    return this.nokService.update(authenticatedUser.id, {
      userId: authenticatedUser.id,
      ...updateNokDto
    });
  }

  @Delete('')
  @ApiOperation({ summary: 'Delete current user\'s next of kin' })
  @ApiResponse({ status: 200, description: 'Next of kin deleted successfully' })
  async remove(@AuthenticatedUser() authenticatedUser: IDecodedJwtToken): Promise<void> {
    return this.nokService.remove(authenticatedUser.id);
  }
} 