import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BVNDataRepository } from '../repositories';
import { BVNData } from '../entities';
import { CreateBvnDataDto, BvnDataResponseDto } from '../dto';
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

  async findOne(userId: string): Promise<BvnDataResponseDto | null> {
    try {
      const bvnData = await this.bvnDataRepository.findOne({ 
        where: { userId } 
      });
      return bvnData ? this.mapToResponseDto(bvnData) : null;
    } catch (error) {
      this.logger.error(`Error finding BVN data: ${error.message}`);
      throw error;
    }
  }

  private mapToResponseDto(bvnData: BVNData): BvnDataResponseDto {
    return plainToClass(BvnDataResponseDto, bvnData, {
      excludeExtraneousValues: true,
    });
  }
} 