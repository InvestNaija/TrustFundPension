import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Referral } from './entities/referral.entity';
import { ReferralService } from './services';
import { ReferralController } from './controllers';
import { UserModule } from '../user';
import { ReferralRepository } from './repositories';


@Module({
  imports: [TypeOrmModule.forFeature([Referral]), UserModule],
  providers: [ReferralService, ReferralRepository],
  controllers: [ReferralController],
  exports: [ReferralService],
})
export class ReferralModule {} 