import { Module } from '@nestjs/common';
import { TrustFundService } from './trustfund';
import { HttpRequestModule } from '../../shared/http-request';

@Module({
  imports: [HttpRequestModule],
  providers: [TrustFundService],
  exports: [TrustFundService],
})
export class ThirdPartyServicesModule {}
