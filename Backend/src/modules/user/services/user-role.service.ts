import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRole } from '../entities';
import { CreateUserRoleDto, UpdateUserRoleDto, UserRoleResponseDto } from '../dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class UserRoleService {
  private readonly logger = new Logger(UserRoleService.name);

  constructor(
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
  ) {}

  async create(createUserRoleDto: CreateUserRoleDto): Promise<UserRoleResponseDto> {
    try {
      const userRole = this.userRoleRepository.create(createUserRoleDto);
      const savedUserRole = await this.userRoleRepository.save(userRole);
      return plainToClass(UserRoleResponseDto, savedUserRole);
    } catch (error) {
      this.logger.error(`Error creating user role: ${error.message}`);
      throw error;
    }
  }

  async findAll(): Promise<UserRoleResponseDto[]> {
    try {
      const userRoles = await this.userRoleRepository.find();
      return userRoles.map(userRole => plainToClass(UserRoleResponseDto, userRole));
    } catch (error) {
      this.logger.error(`Error finding all user roles: ${error.message}`);
      throw error;
    }
  }

  async findOne(id: string): Promise<UserRoleResponseDto> {
    try {
      const userRole = await this.userRoleRepository.findOne({ where: { id } });
      if (!userRole) {
        throw new NotFoundException(`User role with ID ${id} not found`);
      }
      return plainToClass(UserRoleResponseDto, userRole);
    } catch (error) {
      this.logger.error(`Error finding user role: ${error.message}`);
      throw error;
    }
  }

  async update(id: string, updateUserRoleDto: UpdateUserRoleDto): Promise<UserRoleResponseDto> {
    try {
      const userRole = await this.userRoleRepository.findOne({ where: { id } });
      if (!userRole) {
        throw new NotFoundException(`User role with ID ${id} not found`);
      }

      Object.assign(userRole, updateUserRoleDto);
      const updatedUserRole = await this.userRoleRepository.save(userRole);
      return plainToClass(UserRoleResponseDto, updatedUserRole);
    } catch (error) {
      this.logger.error(`Error updating user role: ${error.message}`);
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const result = await this.userRoleRepository.softDelete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`User role with ID ${id} not found`);
      }
    } catch (error) {
      this.logger.error(`Error removing user role: ${error.message}`);
      throw error;
    }
  }
} 