import { Module } from '@nestjs/common';
import { TrustFundService } from './trustfund';
import { HttpRequestModule } from '../../shared/http-request';
import { VerifyMeService } from './verifyme/verifyme.service';
import { QoreIdService } from './qoreid/qoreid.service';
import { CloudinaryService } from './cloudinary';

@Module({
  imports: [HttpRequestModule],
  providers: [TrustFundService, VerifyMeService, QoreIdService, CloudinaryService],
  exports: [TrustFundService, VerifyMeService, QoreIdService, CloudinaryService],
})
export class ThirdPartyServicesModule {}
