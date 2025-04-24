import { Repository } from 'typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { Nok } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractRepository } from '../../../core/database';

@Injectable()
export class NokRepository extends AbstractRepository<Nok> {
  private readonly logger = new Logger(NokRepository.name);

  constructor(
    @InjectRepository(Nok)
    private readonly nokRepository: Repository<Nok>,
  ) {
    super(nokRepository, Nok);
  }

} 