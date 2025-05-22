import { Injectable, Logger, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Media } from '../entities/media.entity';
import { CreateMediaDto, UpdateMediaDto } from '../dto';
import { MediaRepository } from '../repositories';
import { UPLOAD_TYPE } from 'src/core/constants';
import { IApiResponse } from 'src/core/types';
import { User } from '../../../modules/user/entities/user.entity';
import { CloudinaryService } from '../../third-party-services/cloudinary';

@Injectable()
export class MediaService {
  private readonly logger = new Logger(MediaService.name);

  constructor(
    @InjectRepository(Media)
    private readonly mediaRepository: MediaRepository,
    private readonly cloudinaryService: CloudinaryService
  ) {}

  async create(createMediaDto: CreateMediaDto): Promise<IApiResponse> {
    try {
      const { user, ...mediaData } = createMediaDto;
      const newMedia = await this.mediaRepository.save({
        ...mediaData,
        user: { id: user }
      });
      return {
        status: true,
        message: 'Media created successfully',
        data: newMedia
      };
    } catch (error) {
      this.logger.error(`Error creating media: ${error.message}`);
      throw error;
    }
  }

  async findAll(userId: string): Promise<IApiResponse> {
    try {
      this.logger.debug('Fetching all media from database...');
      const media = await this.mediaRepository.find({
        relations: ['user'],
        where: { user: { id: userId } },
        order: { createdAt: 'DESC' }
      });
      this.logger.debug(`Found ${media.length} media items`);
      return {
        status: true,
        message: 'Media retrieved successfully',
        data: media
      };
    } catch (error) {
      this.logger.error(`Error finding all media: ${error.message}`);
      throw error;
    }
  }

  async findOne(id: string): Promise<IApiResponse> {
    try {
      const media = await this.mediaRepository.findOne({ 
        where: { id },
        relations: ['user']
      });
      if (!media) {
        throw new NotFoundException(`Media with ID ${id} not found`);
      }
      return {
        status: true,
        message: 'Media retrieved successfully',
        data: media
      };
    } catch (error) {
      this.logger.error(`Error finding media: ${error.message}`);
      throw error;
    }
  }

  async findByUploadType(uploadType: UPLOAD_TYPE, userId: string): Promise<IApiResponse> {
    try {
      const media = await this.mediaRepository.find({
        where: { upload_type: uploadType, user: { id: userId } },
        relations: ['user'],
        order: { createdAt: 'DESC' }
      });
      return {
        status: true,
        message: 'Media retrieved successfully',
        data: media
      };
    } catch (error) {
      this.logger.error(`Error finding media by upload type: ${error.message}`);
      throw error;
    }
  }

  async findByTags(tags: string, userId: string): Promise<IApiResponse> {
    try {
      const media = await this.mediaRepository.find({
        where: { tags, user: { id: userId } },
        relations: ['user'],
        order: { createdAt: 'DESC' }
      });
      return {
        status: true,
        message: 'Media retrieved successfully',
        data: media
      };
    } catch (error) {
      this.logger.error(`Error finding media by tags: ${error.message}`);
      throw error;
    }
  }

  async findByUser(userId: string): Promise<IApiResponse> {
    try {
      const media = await this.mediaRepository.find({
        where: { user: { id: userId } },
        relations: ['user'],
        order: { createdAt: 'DESC' }
      });
      return {
        status: true,
        message: 'Media retrieved successfully',
        data: media
      };
    } catch (error) {
      this.logger.error(`Error finding media by user: ${error.message}`);
      throw error;
    }
  }

  async findByFileType(fileType: string, userId: string): Promise<IApiResponse> {
    try {
      const media = await this.mediaRepository.find({
        where: { 
          file_type: fileType,
          user: { id: userId }
        },
        relations: ['user'],
        order: { createdAt: 'DESC' }
      });

      return {
        status: true,
        message: 'Media retrieved successfully',
        data: media
      };
    } catch (error) {
      this.logger.error(`Error finding media by file type: ${error.message}`);
      throw error;
    }
  }

  async update(id: string, updateMediaDto: Partial<CreateMediaDto>, userId: string): Promise<IApiResponse> {
    try {
      const media = await this.mediaRepository.findOne({ 
        where: { id, user: { id: userId } },
        relations: ['user']
      });
      if (!media) {
        throw new NotFoundException(`Media with ID ${id} not found`);
      }

      const { user, ...updateData } = updateMediaDto;
      await this.mediaRepository.update({ id }, updateData);
      const updatedMedia = await this.mediaRepository.findOne({ 
        where: { id },
        relations: ['user']
      });
      return {
        status: true,
        message: 'Media updated successfully',
        data: updatedMedia || {}
      };
    } catch (error) {
      this.logger.error(`Error updating media: ${error.message}`);
      throw error;
    }
  }

  async remove(id: string, userId: string): Promise<IApiResponse> {
    try {
      const result = await this.mediaRepository.delete({ id, user: { id: userId } });
      if (result.affected === 0) {
        throw new NotFoundException(`Media with ID ${id} not found`);
      }
      return {
        status: true,
        message: 'Media deleted successfully',
        data: {}
      };
    } catch (error) {
      this.logger.error(`Error removing media: ${error.message}`);
      throw error;
    }
  }

  async fileUpload(data: CreateMediaDto & { file: Express.Multer.File }) {
    try {
      // Upload to Cloudinary using the service
      const result = await this.cloudinaryService.upload(data.file);

      if (!result.success || !result.data?.url) {
        throw new UnprocessableEntityException(result.message || 'Could not upload file');
      }

      // Create media record
      const media = new Media();
      media.user = { id: data.user } as User;
      media.upload_type = data.upload_type;
      media.file_url = result.data.url;
      media.file_type = data.file.mimetype;
      media.file_size = data.file.size;

      const savedMedia = await this.mediaRepository.save(media);

      return {
        status: true,
        message: 'File uploaded successfully',
        data: {
          id: savedMedia.id,
          url: savedMedia.file_url,
          fileType: savedMedia.file_type,
          fileSize: savedMedia.file_size,
          uploadType: savedMedia.upload_type,
          createdAt: savedMedia.createdAt
        }
      };
    } catch (error) {
      this.logger.error('Error uploading file:', error);
      throw new UnprocessableEntityException('Could not upload file');
    }
  }
} 