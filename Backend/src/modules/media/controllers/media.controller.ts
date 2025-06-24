import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from '@nestjs/common';
import { MediaService } from '../services';
import { CreateMediaDto, UpdateMediaDto } from '../dto';
import { JwtAuthGuard } from '../../../core/auth/guards/jwt-auth.guard';
import { AdminAuthGuard } from '../../../core/auth/guards/admin-auth.guard';
import { AuthenticatedUser } from '../../../core/decorators';
import { IDecodedJwtToken } from '../../../modules/auth/strategies/types';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { Media } from '../entities/media.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { UPLOAD_TYPE } from '../../../core/constants';

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

  @Post('upload')
  @ApiOperation({ summary: 'Upload a file' })
  @ApiResponse({ status: 201, description: 'File uploaded successfully' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async fileUpload(
    @AuthenticatedUser() authenticatedUser: IDecodedJwtToken,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif|pdf|doc|docx)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body() createMediaDto: CreateMediaDto
  ) {
    return this.mediaService.fileUpload({
      ...createMediaDto,
      user: authenticatedUser.id,
      file
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

  @ApiOperation({ summary: 'Get media by ID' })
  @ApiResponse({ status: 200, description: 'Return media by ID', type: Media })
  @ApiResponse({ status: 404, description: 'Media not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(AdminAuthGuard)
  @Get('admin/:userId')
  findOneById(@Param('userId') userId: string) {
    return this.mediaService.findAll(userId);
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

  @ApiOperation({ summary: 'Get media by upload type for authenticated user' })
  @ApiResponse({ status: 200, description: 'Return media by upload type', type: [Media] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get('upload-type/:uploadType')
  findByUploadType(
    @Param('uploadType') uploadType: UPLOAD_TYPE,
    @AuthenticatedUser() authenticatedUser: IDecodedJwtToken
  ) {
    return this.mediaService.findByUploadType(uploadType, authenticatedUser.id);
  }
} 