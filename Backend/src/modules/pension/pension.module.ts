import { Module } from '@nestjs/common';
import { PensionController } from './controllers';
import { PensionService } from './services';
import { ThirdPartyServicesModule } from '../third-party-services';


@Module({
  imports: [ThirdPartyServicesModule],
  controllers: [PensionController],
  providers: [PensionService],
  exports: [PensionService],
})
export class PensionModule {}