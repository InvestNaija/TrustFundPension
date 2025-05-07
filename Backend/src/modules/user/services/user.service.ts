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
      return await this.userRepository.findOne({ where: { pen: rsaPin } });
    } catch (error) {
      this.logger.error(`Error finding user by RSA PIN: ${error.message}`);
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

  async updatePassword(id: string, updateData: { password: string; passwordChangedAt: Date; otpCodeHash: string | null; otpCodeExpiry: Date | null }): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    Object.assign(user, updateData);
    const updatedUser = await this.userRepository.save(user);
    return this.mapToResponseDto(updatedUser);
  }

  async updateVerificationData(userId: string, data: { nin?: string; bvn?: string }) {
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (data.nin) {
        user.nin = data.nin;
      }
      if (data.bvn) {
        user.bvn = data.bvn;
      }

      return this.userRepository.save(user);
    } catch (error) {
      this.logger.error('Error updating verification data:', error);
      throw error;
    }
  }

  private mapToResponseDto(user: User): UserResponseDto {
    const userDto = new UserResponseDto();
    userDto.id = user.id;
    userDto.bvn = user.bvn;
    userDto.nin = user.nin;
    userDto.pen = user.pen;
    userDto.firstName = user.firstName;
    userDto.middleName = user.middleName;
    userDto.lastName = user.lastName;
    userDto.email = user.email;
    userDto.dob = user.dob;
    userDto.gender = user.gender;
    userDto.phone = user.phone;
    userDto.uuidToken = user.uuidToken;
    userDto.refCode = user.refCode;
    userDto.referrer = user.referrer;
    userDto.showBalance = user.showBalance;
    userDto.stateOfPosting = user.stateOfPosting;
    userDto.lgaOfPosting = user.lgaOfPosting;
    userDto.isEnabled = user.isEnabled;
    userDto.isLocked = user.isLocked;
    userDto.firstLogin = user.firstLogin;
    userDto.twoFactorAuth = user.twoFactorAuth;
    userDto.role = user.role;
    userDto.accountType = user.accountType;
    userDto.isEmailVerified = user.isEmailVerified;
    userDto.isPhoneVerified = user.isPhoneVerified;
    userDto.createdAt = user.createdAt;
    userDto.updatedAt = user.updatedAt;
    return userDto;
  }
}