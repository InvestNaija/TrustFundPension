import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Media } from '../entities/media.entity';
import { CreateMediaDto } from '../dto/create-media.dto';
import { MediaRepository } from '../repositories';
import { UPLOAD_TYPE } from 'src/core/constants';

@Injectable()
export class MediaService {
  private readonly logger = new Logger(MediaService.name);

  constructor(private readonly mediaRepository: MediaRepository) {}

  async create(createMediaDto: CreateMediaDto): Promise<Media> {
    try {
      const { user, ...mediaData } = createMediaDto;
      return await this.mediaRepository.save({
        ...mediaData,
        user: { id: user }
      });
    } catch (error) {
      this.logger.error(`Error creating media: ${error.message}`);
      throw error;
    }
  }

  async findAll(userId: string): Promise<Media[]> {
    try {
      this.logger.debug('Fetching all media from database...');
      const media = await this.mediaRepository.find({
        relations: ['user'],
        where: { user: { id: userId } },
        order: { createdAt: 'DESC' }
      });
      this.logger.debug(`Found ${media.length} media items`);
      return media;
    } catch (error) {
      this.logger.error(`Error finding all media: ${error.message}`);
      throw error;
    }
  }

  async findOne(id: string): Promise<Media> {
    try {
      const media = await this.mediaRepository.findOne({ 
        where: { id },
        relations: ['user']
      });
      if (!media) {
        throw new NotFoundException(`Media with ID ${id} not found`);
      }
      return media;
    } catch (error) {
      this.logger.error(`Error finding media: ${error.message}`);
      throw error;
    }
  }

  async findByUploadType(uploadType: UPLOAD_TYPE, userId: string): Promise<Media[]> {
    try {
      return await this.mediaRepository.find({
        where: { upload_type: uploadType, user: { id: userId } },
        relations: ['user'],
        order: { createdAt: 'DESC' }
      });
    } catch (error) {
      this.logger.error(`Error finding media by upload type: ${error.message}`);
      throw error;
    }
  }

  async findByTags(tags: string, userId: string): Promise<Media[]> {
    try {
      return await this.mediaRepository.find({
        where: { tags, user: { id: userId } },
        relations: ['user'],
        order: { createdAt: 'DESC' }
      });
    } catch (error) {
      this.logger.error(`Error finding media by tags: ${error.message}`);
      throw error;
    }
  }

  async findByUser(userId: string): Promise<Media[]> {
    try {
      return await this.mediaRepository.find({
        where: { user: { id: userId } },
        relations: ['user'],
        order: { createdAt: 'DESC' }
      });
    } catch (error) {
      this.logger.error(`Error finding media by user: ${error.message}`);
      throw error;
    }
  }

  async update(id: string, updateMediaDto: Partial<CreateMediaDto>, userId: string): Promise<Media> {
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
      return await this.findOne(id);
    } catch (error) {
      this.logger.error(`Error updating media: ${error.message}`);
      throw error;
    }
  }

  async remove(id: string, userId: string): Promise<void> {
    try {
      const result = await this.mediaRepository.delete({ id, user: { id: userId } });
      if (result.affected === 0) {
        throw new NotFoundException(`Media with ID ${id} not found`);
      }
    } catch (error) {
      this.logger.error(`Error removing media: ${error.message}`);
      throw error;
    }
  }
} 