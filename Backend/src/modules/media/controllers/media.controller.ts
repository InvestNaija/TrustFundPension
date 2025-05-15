import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { MediaService } from '../services';
import { CreateMediaDto, UpdateMediaDto } from '../dto';
import { JwtAuthGuard } from '../../../core/auth/guards/jwt-auth.guard';
import { AuthenticatedUser } from '../../../core/decorators';
import { IDecodedJwtToken } from '../../../modules/auth/strategies/types';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Media } from '../entities/media.entity';

@ApiTags('Media')
@ApiBearerAuth()
@Controller('media')
@UseGuards(JwtAuthGuard)
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @ApiOperation({ summary: 'Create new media' })
  @ApiResponse({ status: 201, description: 'Media created successfully', type: Media })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Post()
  create(@AuthenticatedUser() authenticatedUser: IDecodedJwtToken, @Body() createMediaDto: CreateMediaDto) {
    return this.mediaService.create({
      ...createMediaDto,
      user: authenticatedUser.id
    });
  }

  @ApiOperation({ summary: 'Get all media for authenticated user' })
  @ApiResponse({ status: 200, description: 'Return all media', type: [Media] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get()
  findAll(@AuthenticatedUser() authenticatedUser: IDecodedJwtToken) {
    return this.mediaService.findAll(authenticatedUser.id);
  }

  @ApiOperation({ summary: 'Get media by ID' })
  @ApiResponse({ status: 200, description: 'Return media by ID', type: Media })
  @ApiResponse({ status: 404, description: 'Media not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mediaService.findOne(id);
  }

  @ApiOperation({ summary: 'Update media by ID' })
  @ApiResponse({ status: 200, description: 'Media updated successfully', type: Media })
  @ApiResponse({ status: 404, description: 'Media not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMediaDto: UpdateMediaDto, @AuthenticatedUser() authenticatedUser: IDecodedJwtToken) {
    return this.mediaService.update(id, updateMediaDto, authenticatedUser.id);
  }

  @ApiOperation({ summary: 'Delete media by ID' })
  @ApiResponse({ status: 200, description: 'Media deleted successfully' })
  @ApiResponse({ status: 404, description: 'Media not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Delete(':id')
  remove(@Param('id') id: string, @AuthenticatedUser() authenticatedUser: IDecodedJwtToken) {
    return this.mediaService.remove(id, authenticatedUser.id);
  }
} 