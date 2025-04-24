import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmployerRepository } from '../repositories';
import { Employer } from '../entities';
import { CreateEmployerDto, UpdateEmployerDto, EmployerResponseDto } from '../dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class EmployerService {
  private readonly logger = new Logger(EmployerService.name);

  constructor(
    @InjectRepository(Employer)
    private readonly employerRepository: EmployerRepository,
  ) {}

  async create(createEmployerDto: CreateEmployerDto): Promise<EmployerResponseDto> {
    const employer = new Employer();
    Object.assign(employer, createEmployerDto);
    const savedEmployer = await this.employerRepository.save(employer);
    return this.mapToResponseDto(savedEmployer);
  }

  async findAll(): Promise<EmployerResponseDto[]> {
    try {
      const employers = await this.employerRepository.findMany({});
      return employers.map(employer => this.mapToResponseDto(employer));
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
      return this.mapToResponseDto(employer);
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
      return this.mapToResponseDto(updatedEmployer);
    } catch (error) {
      this.logger.error(`Error updating employer: ${error.message}`);
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const result = await this.employerRepository.softDelete({ id });
      if (result.affected === 0) {
        throw new NotFoundException(`Employer with ID ${id} not found`);
      }
    } catch (error) {
      this.logger.error(`Error removing employer: ${error.message}`);
      throw error;
    }
  }

  private mapToResponseDto(employer: Employer): EmployerResponseDto {
    return plainToClass(EmployerResponseDto, employer, {
      excludeExtraneousValues: true,
    });
  }
} 