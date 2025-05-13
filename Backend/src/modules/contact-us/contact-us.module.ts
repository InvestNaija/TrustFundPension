import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactUsController } from './controllers';
import { ContactUsService } from './services';
import { ContactUs } from './entities';
import { UserModule } from '../user';
import { ContactUsRepository } from './repositories';

@Module({
  imports: [TypeOrmModule.forFeature([ContactUs]), UserModule],
  controllers: [ContactUsController],
  providers: [ContactUsService, ContactUsRepository],
  exports: [ContactUsService],
})
export class ContactUsModule {} 