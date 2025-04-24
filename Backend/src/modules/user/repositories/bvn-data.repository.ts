import { Repository } from 'typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { BVNData } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractRepository } from '../../../core/database';

@Injectable()
export class BVNDataRepository extends AbstractRepository<BVNData> {
  private readonly logger = new Logger(BVNDataRepository.name);

  constructor(
    @InjectRepository(BVNData)
    private readonly bvnDataRepository: Repository<BVNData>,
  ) {
    super(bvnDataRepository, BVNData);
  }

} 