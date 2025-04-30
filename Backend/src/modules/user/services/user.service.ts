import {
    Injectable,
    Logger,
    NotFoundException,
    UnauthorizedException,
    BadRequestException
  } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserResponseDto } from '../dto/user-response.dto';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: UserRepository,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const user = new User();
    Object.assign(user, {
      ...createUserDto,
      otpCodeHash: createUserDto.otpCodeHash || undefined,
    });
    const savedUser = await this.userRepository.save(user);
    return this.mapToResponseDto(savedUser);
  }

  async findOne(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return this.mapToResponseDto(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findByPhone(phone: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { phone } });
  }

  async findByRsaPin(rsaPin: string): Promise<any | null> {
    try {
      return await this.userRepository.findOne({ where: { rsa_pin: rsaPin } });
    } catch (error) {
      this.logger.error(`Error finding user by RSA PIN: ${error.message}`);
      throw error;
    }
  }

  async findByPhone(phone: string): Promise<any | null> {
    try {
      return await this.userRepository.findOne({ where: { phone } });
    } catch (error) {
      this.logger.error(`Error finding user by phone: ${error.message}`);
      throw error;
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    Object.assign(user, updateUserDto);
    const updatedUser = await this.userRepository.save(user);
    return this.mapToResponseDto(updatedUser);
  }

  async getClientDetails() {
    return {
      status: true,
      message: 'User details fetched successfully'
    };
  }

  async generateSignedUrlsForUserFiles(user: UserResponseDto) {
    return {
      profileImageUrl: null,
      businessCertificateUrl: null
    };
  }

  private mapToResponseDto(user: User): UserResponseDto {
    const userDto = new UserResponseDto();
    userDto.id = user.id;
    userDto.bvn = user.bvn;
    userDto.nin = user.nin;
    userDto.rsa_pin = user.rsa_pin;
    userDto.first_name = user.first_name;
    userDto.middle_name = user.middle_name;
    userDto.last_name = user.last_name;
    userDto.email = user.email;
    userDto.dob = user.dob;
    userDto.gender = user.gender;
    userDto.phone = user.phone;
    userDto.uuid_token = user.uuid_token;
    userDto.ref_code = user.ref_code;
    userDto.referrer = user.referrer;
    userDto.show_balance = user.show_balance;
    userDto.state_of_posting = user.state_of_posting;
    userDto.lga_of_posting = user.lga_of_posting;
    userDto.is_enabled = user.is_enabled;
    userDto.is_locked = user.is_locked;
    userDto.first_login = user.first_login;
    userDto.two_factor_auth = user.two_factor_auth;
    userDto.role = user.role;
    userDto.account_type = user.accountType;
    userDto.isEmailVerified = user.isEmailVerified;
    userDto.isPhoneVerified = user.isPhoneVerified;
    userDto.createdAt = user.createdAt;
    userDto.updatedAt = user.updatedAt;
    return userDto;
  }
}