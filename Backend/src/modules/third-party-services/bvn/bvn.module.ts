import { Module } from '@nestjs/common';
import { BvnService } from './bvn.service';
import { HttpRequestModule } from '../../../shared/http-request/http-request.module';
import { UserModule } from '../../user/user.module';
import { BvnController } from './bvn.controller';

@Module({
  imports: [HttpRequestModule, UserModule],
  controllers: [BvnController],
  providers: [BvnService],
  exports: [BvnService],
})
export class BvnModule {} 