import { Repository } from 'typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { Employer } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractRepository } from '../../../core/database';

@Injectable()
export class EmployerRepository extends AbstractRepository<Employer> {
  private readonly logger = new Logger(EmployerRepository.name);

  constructor(
    @InjectRepository(Employer)
    private readonly employerRepository: Repository<Employer>,
  ) {
    super(employerRepository, Employer);
  }
} 