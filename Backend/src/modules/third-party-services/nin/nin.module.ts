import { Module } from '@nestjs/common';
import { NinService } from './nin.service';
import { HttpRequestModule } from '../../../shared/http-request/http-request.module';
import { UserModule } from '../../user/user.module';
import { NinController } from './nin.controller';

@Module({
  imports: [HttpRequestModule, UserModule],
  controllers: [NinController],
  providers: [NinService],
  exports: [NinService],
})
export class NinModule {} 