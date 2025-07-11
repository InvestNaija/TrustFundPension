import {
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRole } from '../entities';
import { UserRoleRepository } from '../repositories';
import { CreateUserRoleDto, UpdateUserRoleDto, UserRoleResponseDto } from '../dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class UserRoleService {
  private readonly logger = new Logger(UserRoleService.name);

  constructor(
    @InjectRepository(UserRole)
    private readonly userRoleRepository: UserRoleRepository,
  ) {}

  async create(createUserRoleDto: CreateUserRoleDto): Promise<UserRoleResponseDto> {
    const userRole = new UserRole();
    Object.assign(userRole, createUserRoleDto);
    const savedUserRole = await this.userRoleRepository.save(userRole);
    return this.mapToResponseDto(savedUserRole);
  }

  async findAll(): Promise<UserRoleResponseDto[]> {
    try {
      const userRoles = await this.userRoleRepository.find();
      return userRoles.map(userRole => this.mapToResponseDto(userRole));
    } catch (error) {
      this.logger.error(`Error finding all user roles: ${error.message}`);
      throw error;
    }
  }

  async findOne(id: string): Promise<UserRoleResponseDto> {
    try {
      const userRole = await this.userRoleRepository.findOne({ where: { id }, relations: [
        'roles'
      ], });
      if (!userRole) {
        throw new NotFoundException(`User role with ID ${id} not found`);
      }
      return this.mapToResponseDto(userRole);
    } catch (error) {
      this.logger.error(`Error finding user role: ${error.message}`);
      throw error;
    }
  }

  async findOneAuthAdmin(id: string): Promise<UserRole | null> {
    try {
      const userRole = await this.userRoleRepository.findOne({ 
        where: { userId: id, role: { name: 'admin' } }, 
        relations: [
        'role'
      ] 
    });
      return userRole;
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
      return this.mapToResponseDto(updatedUserRole);
    } catch (error) {
      this.logger.error(`Error updating user role: ${error.message}`);
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const result = await this.userRoleRepository.softDelete({ id });
      if (result.affected === 0) {
        throw new NotFoundException(`User role with ID ${id} not found`);
      }
    } catch (error) {
      this.logger.error(`Error removing user role: ${error.message}`);
      throw error;
    }
  }

  private mapToResponseDto(userRole: UserRole): UserRoleResponseDto {
    return plainToClass(UserRoleResponseDto, userRole, {
      excludeExtraneousValues: true,
    });
  }
} 