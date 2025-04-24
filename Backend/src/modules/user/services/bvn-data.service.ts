import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BVNDataRepository } from '../repositories';
import { BVNData } from '../entities';
import { CreateBvnDataDto, UpdateBvnDataDto, BvnDataResponseDto } from '../dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class BvnDataService {
  private readonly logger = new Logger(BvnDataService.name);

  constructor(
    @InjectRepository(BVNData)
    private readonly bvnDataRepository: BVNDataRepository,
  ) {}

  async create(createBvnDataDto: CreateBvnDataDto): Promise<BvnDataResponseDto> {
    const bvnData = new BVNData();
    Object.assign(bvnData, createBvnDataDto);
    const savedBvnData = await this.bvnDataRepository.save(bvnData);
    return this.mapToResponseDto(savedBvnData);
  }

  async findAll(): Promise<BvnDataResponseDto[]> {
    try {
      const bvnData = await this.bvnDataRepository.findMany({});
      return bvnData.map(data => this.mapToResponseDto(data));
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
      return this.mapToResponseDto(bvnData);
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
      return this.mapToResponseDto(updatedBvnData);
    } catch (error) {
      this.logger.error(`Error updating BVN data: ${error.message}`);
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const result = await this.bvnDataRepository.softDelete({ id });
      if (result.affected === 0) {
        throw new NotFoundException(`BVN data with ID ${id} not found`);
      }
    } catch (error) {
      this.logger.error(`Error removing BVN data: ${error.message}`);
      throw error;
    }
  }

  private mapToResponseDto(bvnData: BVNData): BvnDataResponseDto {
    return plainToClass(BvnDataResponseDto, bvnData, {
      excludeExtraneousValues: true,
    });
  }
} 