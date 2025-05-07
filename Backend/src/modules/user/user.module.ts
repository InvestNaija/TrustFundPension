import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, UserRole, Nok, Employer, BVNData } from './entities';
import { UserController, UserRoleController, NokController, EmployerController, BvnDataController } from './controllers';
import { UserService, UserRoleService, NokService, EmployerService, BvnDataService, VerificationService } from './services';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserRole, Nok, Employer, BVNData]),
  ],
  controllers: [
    UserController,
    UserRoleController,
    NokController,
    EmployerController,
    BvnDataController,
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