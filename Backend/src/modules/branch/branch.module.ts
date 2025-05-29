import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Branch } from './entities/branch.entity';
import { BranchService } from './services/branch.service';
import { BranchController } from './controllers/branch.controller';
import { UserModule } from '../user';

@Module({
  imports: [
    TypeOrmModule.forFeature([Branch]),
    UserModule
  ],
  controllers: [BranchController],
  providers: [BranchService],
  exports: [BranchService],
})
export class BranchModule {} 