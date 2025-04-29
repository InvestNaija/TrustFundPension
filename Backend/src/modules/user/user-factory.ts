import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities';
import { USER_ROLE } from '../../core/constants';

@Injectable()
export class UserFactory {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  getRepository(role: string): Repository<User> {
    return this.userRepository;
  }
} 