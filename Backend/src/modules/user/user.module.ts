import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, UserRole, Nok, Employer, BVNData } from './entities';
import { UserController, UserRoleController, NokController, EmployerController, BvnDataController } from './controllers';
import { UserService, UserRoleService, NokService, EmployerService, BvnDataService, VerificationService } from './services';
import { ThirdPartyServicesModule } from '../third-party-services/third-party-services.module';
import { VerificationController } from './controllers/verification.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserRole, Nok, Employer, BVNData]),
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
  ],
  exports: [
    UserService,
    UserRoleService,
    NokService,
    EmployerService,
    BvnDataService,
    VerificationService,
  ],
})
export class UserModule {}