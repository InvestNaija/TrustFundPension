import { Repository } from 'typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { UserRole } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractRepository } from '../../../core/database';

@Injectable()
export class UserRoleRepository extends AbstractRepository<UserRole> {
  private readonly logger = new Logger(UserRoleRepository.name);

  constructor(
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
  ) {
    super(userRoleRepository, UserRole);
  }

} 