import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaController } from './controllers';
import { MediaService } from './services';
import { UserModule } from '../user';
import { Media } from './entities';
import { MediaRepository } from './repositories';
import { ThirdPartyServicesModule } from '../third-party-services';

@Module({
  imports: [TypeOrmModule.forFeature([Media]), UserModule, ThirdPartyServicesModule],
  controllers: [MediaController],
  providers: [MediaService, MediaRepository],
  exports: [MediaService],
})
export class MediaModule {} 