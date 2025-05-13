import { Repository } from 'typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { Media } from '../entities/media.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractRepository } from '../../../core/database';

@Injectable()
export class MediaRepository extends AbstractRepository<Media> {
  private readonly logger = new Logger(MediaRepository.name);

  constructor(
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,
  ) {
    super(mediaRepository, Media);
  }
} 