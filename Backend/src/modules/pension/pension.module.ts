import { Module } from '@nestjs/common';
import { PensionController } from './controllers';
import { PensionService } from './services';
import { UserModule } from '../user';
import { ThirdPartyServicesModule } from '../third-party-services';

@Module({
  imports: [
    UserModule,
    ThirdPartyServicesModule],
  controllers: [PensionController],
  providers: [PensionService],
  exports: [PensionService],
})
export class PensionModule {}