import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NokRepository } from '../repositories';
import { Nok } from '../entities';
import { CreateNokDto, UpdateNokDto, NokResponseDto } from '../dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class NokService {
  private readonly logger = new Logger(NokService.name);

  constructor(
    @InjectRepository(Nok)
    private readonly nokRepository: NokRepository,
  ) {}

  async create(createNokDto: CreateNokDto): Promise<NokResponseDto> {
    const nok = new Nok();
    Object.assign(nok, createNokDto);
    const savedNok = await this.nokRepository.save(nok);
    return this.mapToResponseDto(savedNok);
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

  async findOne(id: string): Promise<NokResponseDto> {
    try {
      const nok = await this.nokRepository.findOne({ where: { id } });
      if (!nok) {
        throw new NotFoundException(`Next of kin with ID ${id} not found`);
      }
      return this.mapToResponseDto(nok);
    } catch (error) {
      this.logger.error(`Error finding next of kin: ${error.message}`);
      throw error;
    }
  }

  async update(id: string, updateNokDto: UpdateNokDto): Promise<NokResponseDto> {
    try {
      const nok = await this.nokRepository.findOne({ where: { id } });
      if (!nok) {
        throw new NotFoundException(`Next of kin with ID ${id} not found`);
      }

      Object.assign(nok, updateNokDto);
      const updatedNok = await this.nokRepository.save(nok);
      return this.mapToResponseDto(updatedNok);
    } catch (error) {
      this.logger.error(`Error updating next of kin: ${error.message}`);
      throw error;
    }
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
    return plainToClass(NokResponseDto, nok, {
      excludeExtraneousValues: true,
    });
  }
} 