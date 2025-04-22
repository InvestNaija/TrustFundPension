import {
    Injectable,
    Logger,
    NotFoundException
  } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from '../dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    try {
      const user = this.userRepository.create(createUserDto);
      const savedUser = await this.userRepository.save(user);
      return plainToClass(UserResponseDto, savedUser);
    } catch (error) {
      this.logger.error(`Error creating user: ${error.message}`);
      throw error;
    }
  }

  async findAll(): Promise<UserResponseDto[]> {
    try {
      const users = await this.userRepository.find();
      return users.map(user => plainToClass(UserResponseDto, user));
    } catch (error) {
      this.logger.error(`Error finding all users: ${error.message}`);
      throw error;
    }
  }

  async findOne(id: string): Promise<UserResponseDto> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return plainToClass(UserResponseDto, user);
    } catch (error) {
      this.logger.error(`Error finding user: ${error.message}`);
      throw error;
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      Object.assign(user, updateUserDto);
      const updatedUser = await this.userRepository.save(user);
      return plainToClass(UserResponseDto, updatedUser);
    } catch (error) {
      this.logger.error(`Error updating user: ${error.message}`);
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const result = await this.userRepository.softDelete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
    } catch (error) {
      this.logger.error(`Error removing user: ${error.message}`);
      throw error;
    }
  }

  async getClientDetails(
  ){
    return {
      status: true,
      message: 'User details fetched successfully'
    };
  }
}