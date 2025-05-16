import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, UserRole, Nok, Employer, BVNData } from './entities';
import { UserController, UserRoleController, NokController, EmployerController, BvnDataController } from './controllers';
import { UserService, UserRoleService, NokService, EmployerService, BvnDataService } from './services';

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
  ],
  exports: [
    UserService,
    UserRoleService,
    NokService,
    EmployerService,
    BvnDataService,
  ],
})
export class UserModule {}