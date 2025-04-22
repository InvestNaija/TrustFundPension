import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Nok } from '../entities';
import { CreateNokDto, UpdateNokDto, NokResponseDto } from '../dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class NokService {
  private readonly logger = new Logger(NokService.name);

  constructor(
    @InjectRepository(Nok)
    private readonly nokRepository: Repository<Nok>,
  ) {}

  async create(createNokDto: CreateNokDto): Promise<NokResponseDto> {
    try {
      const nok = this.nokRepository.create(createNokDto);
      const savedNok = await this.nokRepository.save(nok);
      return plainToClass(NokResponseDto, savedNok);
    } catch (error) {
      this.logger.error(`Error creating next of kin: ${error.message}`);
      throw error;
    }
  }

  async findAll(): Promise<NokResponseDto[]> {
    try {
      const noks = await this.nokRepository.find();
      return noks.map(nok => plainToClass(NokResponseDto, nok));
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
      return plainToClass(NokResponseDto, nok);
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
      return plainToClass(NokResponseDto, updatedNok);
    } catch (error) {
      this.logger.error(`Error updating next of kin: ${error.message}`);
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const result = await this.nokRepository.softDelete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Next of kin with ID ${id} not found`);
      }
    } catch (error) {
      this.logger.error(`Error removing next of kin: ${error.message}`);
      throw error;
    }
  }
} 