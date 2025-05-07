import { Module } from '@nestjs/common';
import { TrustFundService } from './trustfund';
import { HttpRequestModule } from '../../shared/http-request';
import { VerifyMeService } from './verifyme/verifyme.service';
import { QoreIdService } from './qoreid/qoreid.service';

@Module({
  imports: [HttpRequestModule],
  providers: [TrustFundService, VerifyMeService, QoreIdService],
  exports: [TrustFundService, VerifyMeService, QoreIdService],
})
export class ThirdPartyServicesModule {}
