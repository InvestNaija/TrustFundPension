import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employer } from '../entities';
import { CreateEmployerDto, UpdateEmployerDto, EmployerResponseDto } from '../dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class EmployerService {
  private readonly logger = new Logger(EmployerService.name);

  constructor(
    @InjectRepository(Employer)
    private readonly employerRepository: Repository<Employer>,
  ) {}

  async create(createEmployerDto: CreateEmployerDto): Promise<EmployerResponseDto> {
    try {
      const employer = this.employerRepository.create(createEmployerDto);
      const savedEmployer = await this.employerRepository.save(employer);
      return plainToClass(EmployerResponseDto, savedEmployer);
    } catch (error) {
      this.logger.error(`Error creating employer: ${error.message}`);
      throw error;
    }
  }

  async findAll(): Promise<EmployerResponseDto[]> {
    try {
      const employers = await this.employerRepository.find();
      return employers.map(employer => plainToClass(EmployerResponseDto, employer));
    } catch (error) {
      this.logger.error(`Error finding all employers: ${error.message}`);
      throw error;
    }
  }

  async findOne(id: string): Promise<EmployerResponseDto> {
    try {
      const employer = await this.employerRepository.findOne({ where: { id } });
      if (!employer) {
        throw new NotFoundException(`Employer with ID ${id} not found`);
      }
      return plainToClass(EmployerResponseDto, employer);
    } catch (error) {
      this.logger.error(`Error finding employer: ${error.message}`);
      throw error;
    }
  }

  async update(id: string, updateEmployerDto: UpdateEmployerDto): Promise<EmployerResponseDto> {
    try {
      const employer = await this.employerRepository.findOne({ where: { id } });
      if (!employer) {
        throw new NotFoundException(`Employer with ID ${id} not found`);
      }

      Object.assign(employer, updateEmployerDto);
      const updatedEmployer = await this.employerRepository.save(employer);
      return plainToClass(EmployerResponseDto, updatedEmployer);
    } catch (error) {
      this.logger.error(`Error updating employer: ${error.message}`);
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const result = await this.employerRepository.softDelete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Employer with ID ${id} not found`);
      }
    } catch (error) {
      this.logger.error(`Error removing employer: ${error.message}`);
      throw error;
    }
  }
} 