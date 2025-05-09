import { Repository } from 'typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { Referral } from '../entities/referral.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractRepository } from '../../../core/database';

@Injectable()
export class ReferralRepository extends AbstractRepository<Referral> {
  private readonly logger = new Logger(ReferralRepository.name);

  constructor(
    @InjectRepository(Referral)
    private readonly referralRepository: Repository<Referral>,
  ) {
    super(referralRepository, Referral);
  }
} 