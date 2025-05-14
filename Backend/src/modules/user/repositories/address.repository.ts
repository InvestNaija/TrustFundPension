import { Repository } from 'typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { Address } from '../entities/address.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractRepository } from '../../../core/database';

@Injectable()
export class AddressRepository extends AbstractRepository<Address> {
  private readonly logger = new Logger(AddressRepository.name);

  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
  ) {
    super(addressRepository, Address);
  }
} 