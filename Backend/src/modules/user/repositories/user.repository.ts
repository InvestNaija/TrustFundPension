import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { User } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractRepository } from '../../../core/database';
import { ListUsersDto } from '../dto';
import { PageMetaDto } from '../../../shared/dto';

@Injectable()
export class UserRepository extends AbstractRepository<User> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super(userRepository, User);
  }
  
}