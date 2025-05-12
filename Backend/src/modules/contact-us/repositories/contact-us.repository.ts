import { Repository } from 'typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { ContactUs } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractRepository } from '../../../core/database';

@Injectable()
export class ContactUsRepository extends AbstractRepository<ContactUs> {
  private readonly logger = new Logger(ContactUsRepository.name);

  constructor(
    @InjectRepository(ContactUs)
    private readonly contactUsRepository: Repository<ContactUs>,
  ) {
    super(contactUsRepository, ContactUs);
  }
} 