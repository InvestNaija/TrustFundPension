import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmployerRepository, AddressRepository } from '../repositories';
import { Employer } from '../entities';
import { Address } from '../entities/address.entity';
import { CreateEmployerDto, UpdateEmployerDto, EmployerResponseDto, AddressResponseDto } from '../dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class EmployerService {
  private readonly logger = new Logger(EmployerService.name);

  constructor(
    @InjectRepository(Employer)
    private readonly employerRepository: EmployerRepository,
    @InjectRepository(Address)
    private readonly addressRepository: AddressRepository,
  ) {}

  async create(createEmployerDto: CreateEmployerDto): Promise<EmployerResponseDto> {
    const employer = new Employer();
    Object.assign(employer, createEmployerDto);
    
    const savedEmployer = await this.employerRepository.save(employer);
    
    if (createEmployerDto.address) {
      const newAddress = new Address();
      Object.assign(newAddress, {
        ...createEmployerDto.address,
        commonId: savedEmployer.id,
        commonType: 'Employer',
        createdAt: new Date(),
        updatedAt: new Date()
      });
      const savedAddress = await this.addressRepository.save(newAddress);
      savedEmployer.addresses = [savedAddress];
    }
    
    const employerWithAddresses = await this.employerRepository.findOne({
      where: { id: savedEmployer.id },
      relations: ['addresses']
    });

    if (!employerWithAddresses) {
      throw new NotFoundException('Employer not found after creation');
    }
    
    return this.mapToResponseDto(employerWithAddresses);
  }

  async findAll(): Promise<EmployerResponseDto[]> {
    try {
      this.logger.debug('Fetching all employers from database...');
      const employers = await this.employerRepository.find({
        relations: ['addresses']
      });
      this.logger.debug(`Found ${employers.length} employers:`, employers);
      
      const mappedEmployers = employers.map(employer => {
        const mapped = this.mapToResponseDto(employer);
        this.logger.debug('Mapped employer:', mapped);
        return mapped;
      });
      
      this.logger.debug('Final response:', mappedEmployers);
      return mappedEmployers;
    } catch (error) {
      this.logger.error(`Error finding all employers: ${error.message}`);
      throw error;
    }
  }

  async findOne(userId: string): Promise<EmployerResponseDto | { status: string, message: string, data: any }> {
    try {
      const employer = await this.employerRepository.findOne({ 
        where: { userId }, 
        order: { createdAt: 'DESC' },
        relations: ['addresses']
      });

      if (!employer) {
        return {
          status: 'success',
          message: 'Employer not found',
          data: []
        };
      }

      return this.mapToResponseDto(employer);
    } catch (error) {
      this.logger.error(`Error finding employer: ${error.message}`);
      throw error;
    }
  }

  async findById(userId: string): Promise<EmployerResponseDto> {
    try {
      const employer = await this.employerRepository.findOne({ 
        where: { userId },
        relations: ['addresses']
      });
      if (!employer) {
        throw new NotFoundException(`Employer with ID ${userId} not found`);
      }
      return this.mapToResponseDto(employer);
    } catch (error) {
      this.logger.error(`Error finding employer: ${error.message}`);
      throw error;
    }
  }

  async update(userId: string, updateEmployerDto: UpdateEmployerDto): Promise<EmployerResponseDto> {
    try {
      const employer = await this.employerRepository.findOne({ 
        where: { userId },
        order: { createdAt: 'DESC' },
        relations: ['addresses']
      });
      if (!employer) {
        throw new NotFoundException(`Employer with ID ${userId} not found`);
      }

      const { address, ...employerData } = updateEmployerDto;
      Object.assign(employer, employerData);

      if (address) {
        const existingAddress = await this.addressRepository.findOne({
          where: { commonId: employer.id, commonType: 'employer' },
        });

        if (existingAddress) {
          Object.assign(existingAddress, address);
          await this.addressRepository.save(existingAddress);
        } else {
          const newAddress = new Address();
          Object.assign(newAddress, {
            ...address,
            commonId: employer.id,
            commonType: 'employer',
          });
          await this.addressRepository.save(newAddress);
        }
      }

      const updatedEmployer = await this.employerRepository.save(employer);
      return this.mapToResponseDto(updatedEmployer);
    } catch (error) {
      this.logger.error(`Error updating employer: ${error.message}`);
      throw error;
    }
  }

  async remove(userId: string): Promise<void> {
    try {
      const result = await this.employerRepository.softDelete({ userId });
      if (result.affected === 0) {
        throw new NotFoundException(`Employer with ID ${userId} not found`);
      }
    } catch (error) {
      this.logger.error(`Error removing employer: ${error.message}`);
      throw error;
    }
  }

  private mapToResponseDto(employer: Employer): EmployerResponseDto {
    const mapped = plainToClass(EmployerResponseDto, employer, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true
    });
    
    if (employer.addresses) {
      mapped.addresses = employer.addresses.map(address => 
        plainToClass(AddressResponseDto, address, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true
        })
      );
    }
    
    this.logger.debug('Mapping employer to DTO:', { original: employer, mapped });
    return mapped;
  }
} 