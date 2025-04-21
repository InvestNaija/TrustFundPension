import { Module } from '@nestjs/common';
import { PensionController } from './controllers';
import { PensionService } from './services';
import { TrustFundService } from '../third-party-services/trustfund/trustfund.service';
import { HttpRequestService } from '../../shared/http-request';

@Module({
  imports: [],
  controllers: [PensionController],
  providers: [PensionService, TrustFundService, HttpRequestService],
  exports: [PensionService],
})
export class PensionModule {}