import { Module } from '@nestjs/common';
import { TrustFundService } from './trustfund';
import { HttpRequestModule } from '../../shared/http-request';
import { NinModule } from './nin/nin.module';
import { BvnModule } from './bvn/bvn.module';

@Module({
  imports: [HttpRequestModule, NinModule, BvnModule],
  providers: [TrustFundService],
  exports: [TrustFundService, NinModule, BvnModule],
})
export class ThirdPartyServicesModule {}
