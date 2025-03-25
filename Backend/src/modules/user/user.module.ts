import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  UserController,
} from './controllers';
import { User } from './entities';
import {
  UserRepository,
} from './repositories';

import {
  UserService,
} from './services';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [
    UserController,
  ],
  providers: [
    UserService,
    UserRepository
  ],
  exports: [
    UserService,
  ],
})
export class UserModule {}