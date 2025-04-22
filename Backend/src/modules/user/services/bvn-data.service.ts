import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BVNData } from '../entities';
import { CreateBvnDataDto, UpdateBvnDataDto, BvnDataResponseDto } from '../dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class BvnDataService {
  private readonly logger = new Logger(BvnDataService.name);

  constructor(
    @InjectRepository(BVNData)
    private readonly bvnDataRepository: Repository<BVNData>,
  ) {}

  async create(createBvnDataDto: CreateBvnDataDto): Promise<BvnDataResponseDto> {
    try {
      const bvnData = this.bvnDataRepository.create(createBvnDataDto);
      const savedBvnData = await this.bvnDataRepository.save(bvnData);
      return plainToClass(BvnDataResponseDto, savedBvnData);
    } catch (error) {
      this.logger.error(`Error creating BVN data: ${error.message}`);
      throw error;
    }
  }

  async findAll(): Promise<BvnDataResponseDto[]> {
    try {
      const bvnData = await this.bvnDataRepository.find();
      return bvnData.map(data => plainToClass(BvnDataResponseDto, data));
    } catch (error) {
      this.logger.error(`Error finding all BVN data: ${error.message}`);
      throw error;
    }
  }

  async findOne(id: string): Promise<BvnDataResponseDto> {
    try {
      const bvnData = await this.bvnDataRepository.findOne({ where: { id } });
      if (!bvnData) {
        throw new NotFoundException(`BVN data with ID ${id} not found`);
      }
      return plainToClass(BvnDataResponseDto, bvnData);
    } catch (error) {
      this.logger.error(`Error finding BVN data: ${error.message}`);
      throw error;
    }
  }

  async update(id: string, updateBvnDataDto: UpdateBvnDataDto): Promise<BvnDataResponseDto> {
    try {
      const bvnData = await this.bvnDataRepository.findOne({ where: { id } });
      if (!bvnData) {
        throw new NotFoundException(`BVN data with ID ${id} not found`);
      }

      Object.assign(bvnData, updateBvnDataDto);
      const updatedBvnData = await this.bvnDataRepository.save(bvnData);
      return plainToClass(BvnDataResponseDto, updatedBvnData);
    } catch (error) {
      this.logger.error(`Error updating BVN data: ${error.message}`);
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const result = await this.bvnDataRepository.softDelete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`BVN data with ID ${id} not found`);
      }
    } catch (error) {
      this.logger.error(`Error removing BVN data: ${error.message}`);
      throw error;
    }
  }
} 