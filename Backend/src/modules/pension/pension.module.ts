import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PensionController } from './controllers/pension.controller';
import { PensionService } from './services/pension.service';
import { UserModule } from '../user/user.module';
import { ThirdPartyServicesModule } from '../third-party-services';
import { FundTransfer } from './entities/fund-transfer.entity';
import { FundTransferController } from './controllers/fund-transfer.controller';
import { FundTransferService } from './services/fund-transfer.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([FundTransfer]),
    UserModule,
    ThirdPartyServicesModule,
  ],
  controllers: [PensionController, FundTransferController],
  providers: [PensionService, FundTransferService],
  exports: [PensionService, FundTransferService],
})
export class PensionModule {}