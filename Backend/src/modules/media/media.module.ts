import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaController } from './controllers';
import { MediaService } from './services';
import { UserModule } from '../user';
import { Media } from './entities';
import { MediaRepository } from './repositories';
@Module({
  imports: [TypeOrmModule.forFeature([Media]), UserModule],
  controllers: [MediaController],
  providers: [MediaService, MediaRepository],
  exports: [MediaService],
})
export class MediaModule {} 