import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NokRepository } from '../repositories';
import { Nok } from '../entities';
import { CreateNokDto, UpdateNokDto, NokResponseDto } from '../dto';
import { Address } from '../entities/address.entity';
import { plainToClass } from 'class-transformer';

@Injectable()
export class NokService {
  private readonly logger = new Logger(NokService.name);

  constructor(
    @InjectRepository(Nok)
    private readonly nokRepository: NokRepository,
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
  ) {}

  async create(createNokDto: CreateNokDto & { userId: string }): Promise<NokResponseDto> {
    const { address, ...nokData } = createNokDto;
    const nok = await this.nokRepository.save(nokData);

    if (address) {
      const newAddress = this.addressRepository.create({
        ...address,
        commonId: nok.id,
        commonType: 'nok',
        createdAt: new Date(),
        updatedAt: new Date()
      });
      const savedAddress = await this.addressRepository.save(newAddress);

      nok.addresses = [savedAddress];
    }

    return this.mapToResponseDto(nok);
  }

  async findAll(): Promise<NokResponseDto[]> {
    try {
      const noks = await this.nokRepository.find();
      return noks.map(nok => this.mapToResponseDto(nok));
    } catch (error) {
      this.logger.error(`Error finding all next of kin: ${error.message}`);
      throw error;
    }
  }

  async findOne(userId: string): Promise<NokResponseDto> {
    try {
      const nok = await this.nokRepository.findOne({ where: { userId } });
      if (!nok) {
        throw new NotFoundException(`Next of kin not found`);
      }
      const addresses = await this.addressRepository.find({ where: { commonId: nok.id, commonType: 'nok' } });
      nok.addresses = addresses;

      return this.mapToResponseDto(nok);
    } catch (error) {
      this.logger.error(`Error finding next of kin: ${error.message}`);
      throw error;
    }
  }

  async update(id: string, updateNokDto: UpdateNokDto): Promise<NokResponseDto> {
    const nok = await this.nokRepository.findOne({ 
      where: { userId: id }
    });
    
    if (!nok) {
      throw new NotFoundException('Next of kin not found');
    }

    const { address, ...nokData } = updateNokDto;
    Object.assign(nok, nokData);

    if (address) {
      const existingAddress = await this.addressRepository.findOne({
        where: { commonId: nok.id, commonType: 'nok' },
      });

      if (existingAddress) {
        Object.assign(existingAddress, address);
        await this.addressRepository.save(existingAddress);
      } else {
        const newAddress = new Address();
        Object.assign(newAddress, {
          ...address,
          commonId: nok.id,
          commonType: 'nok',
        });
        await this.addressRepository.save(newAddress);
      }
    }

    const savedNok = await this.nokRepository.save(nok);
    return this.mapToResponseDto(savedNok);
  }

  async remove(id: string): Promise<void> {
    try {
      const result = await this.nokRepository.softDelete({ id });
      if (result.affected === 0) {
        throw new NotFoundException(`Next of kin with ID ${id} not found`);
      }
    } catch (error) {
      this.logger.error(`Error removing next of kin: ${error.message}`);
      throw error;
    }
  }

  private mapToResponseDto(nok: Nok): NokResponseDto {
    const dto = plainToClass(NokResponseDto, nok, {
      excludeExtraneousValues: true,
    });
    
    if (nok.addresses && nok.addresses.length > 0) {
      dto.address = nok.addresses[0];
    }
    
    return dto;
  }
} 