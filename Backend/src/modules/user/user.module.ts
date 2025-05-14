import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, UserRole, Nok, Employer, BVNData } from './entities';
import { Address } from './entities/address.entity';
import { UserController, UserRoleController, NokController, EmployerController, BvnDataController } from './controllers';
import { UserService, UserRoleService, NokService, EmployerService, BvnDataService, VerificationService } from './services';
import { ThirdPartyServicesModule } from '../third-party-services/third-party-services.module';
import { VerificationController } from './controllers/verification.controller';
import { AddressRepository } from './repositories/address.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserRole, Nok, Employer, BVNData, Address]),
    ThirdPartyServicesModule,
  ],
  controllers: [
    UserController,
    UserRoleController,
    NokController,
    EmployerController,
    BvnDataController,
    VerificationController,
  ],
  providers: [
    UserService,
    UserRoleService,
    NokService,
    EmployerService,
    BvnDataService,
    VerificationService,
    AddressRepository,
  ],
  exports: [
    UserService,
    UserRoleService,
    NokService,
    EmployerService,
    BvnDataService,
    VerificationService,
    AddressRepository,
  ],
})
export class UserModule {}