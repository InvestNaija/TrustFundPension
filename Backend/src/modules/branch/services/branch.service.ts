import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Branch } from '../entities/branch.entity';
import { CreateBranchDto } from '../dto/create-branch.dto';
import { UpdateBranchDto } from '../dto/update-branch.dto';
import { ListBranchesDto } from '../dto/list-branches.dto';
import { IApiResponse } from 'src/core/types';
import { PageDto } from '../../../core/dto/page.dto';
import { PageMetaDto } from '../../../core/dto/page-meta.dto';

@Injectable()
export class BranchService {
  constructor(
    @InjectRepository(Branch)
    private readonly branchRepository: Repository<Branch>,
  ) {}

  async create(createBranchDto: CreateBranchDto): Promise<IApiResponse> {
    const branch = this.branchRepository.create(createBranchDto);
    const savedBranch = await this.branchRepository.save(branch);

    return {
      status: true,
      message: 'Branch created successfully',
      data: savedBranch,
    };
  }

  async findAll(query: ListBranchesDto): Promise<IApiResponse> {
    const { page = 1, limit = 10, search } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.branchRepository.createQueryBuilder('branch');

    if (search) {
      queryBuilder.where(
        '(branch.name ILIKE :search OR branch.email ILIKE :search OR branch.phone ILIKE :search OR branch.fullAddress ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    const [branches, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    const pageMeta = new PageMetaDto(branches.length, total, page, limit);

    return {
      status: true,
      message: 'Branches fetched successfully',
      data: {
        branches,
        meta: pageMeta
      }
    };
  }

  async findOne(id: string): Promise<IApiResponse> {
    const branch = await this.branchRepository.findOne({ where: { id } });
    if (!branch) {
      throw new NotFoundException(`Branch with ID ${id} not found`);
    }

    return {
      status: true,
      message: 'Branch fetched successfully',
      data: branch,
    };
  }

  async update(id: string, updateBranchDto: UpdateBranchDto): Promise<IApiResponse> {
    const branch = await this.branchRepository.findOne({ where: { id } });
    if (!branch) {
      throw new NotFoundException(`Branch with ID ${id} not found`);
    }

    Object.assign(branch, updateBranchDto);
    const updatedBranch = await this.branchRepository.save(branch);

    return {
      status: true,
      message: 'Branch updated successfully',
      data: updatedBranch,
    };
  }

  async remove(id: string): Promise<IApiResponse> {
    const branch = await this.branchRepository.findOne({ where: { id } });
    if (!branch) {
      throw new NotFoundException(`Branch with ID ${id} not found`);
    }

    await this.branchRepository.softDelete(id);

    return {
      status: true,
      message: 'Branch deleted successfully',
      data: {},
    };
  }
} 