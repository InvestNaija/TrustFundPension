import {
    Injectable,
    Logger,
    NotFoundException,
    UnauthorizedException,
    BadRequestException,
    UnprocessableEntityException
  } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserResponseDto } from '../dto/user-response.dto';
import { UserRepository } from '../repositories/user.repository';
import { VerifyMeService } from '../../third-party-services/verifyme/verifyme.service';
import { QoreIdService } from '../../third-party-services/qoreid/qoreid.service';
import { Repository } from 'typeorm';
import { BVNData, UserRole } from '../entities';
import { BvnDataService } from './bvn-data.service';
import { UserRoleService } from './user-role.service';
import { IApiResponse } from 'src/core/types';
import { UPLOAD_TYPE } from 'src/core/constants';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: UserRepository,
    @InjectRepository(BVNData)
    private readonly bvnDataRepository: Repository<BVNData>,
    private readonly verifyMeService: VerifyMeService,
    private readonly qoreIdService: QoreIdService,
    private readonly bvnDataService: BvnDataService,
    private readonly userRoleService: UserRoleService,
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

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ 
      where: { id },
      relations: [
        'employers',
        'media',
        'noks',
      ]
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async kycStatus(id: string): Promise<IApiResponse> {
    const kycInfo = {
      'nin': false,
      'bvn': false,
      'nok': false,
      'employer': false,
      'passport': false,
      'signature': false,
    };
    
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Check basic KYC fields
    if (user.bvn) kycInfo.bvn = true;
    if (user.nin) kycInfo.nin = true;
    if (user.employers?.length > 0) kycInfo.employer = true;
    if (user.noks?.length > 0) kycInfo.nok = true;

    // Check media files
    if (user.media?.length > 0) {
      const hasPassport = user.media.some(media => media.upload_type === UPLOAD_TYPE.PASSPORT_PHOTO);
      const hasSignature = user.media.some(media => media.upload_type === UPLOAD_TYPE.SIGNATURE);
      
      if (hasPassport) kycInfo.passport = true;
      if (hasSignature) kycInfo.signature = true;
    }
    
    return {
      status: true,
      message: 'Customer onboarding status fetched successfully',
      data: kycInfo,
    };
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

  async getBvnDetails(bvn: string, firstName: string, lastName: string, userId: string): Promise<any> {
    try {
      const existingBvnData = await this.bvnDataService.findOne(userId);
      
      if (existingBvnData) {
        const formattedData = this.formatBvnResponse(existingBvnData.bvnResponse);
        return {
          status: true,
          message: 'BVN details retrieved',
          data: formattedData,
        };
      }

      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const bvnResponse = await this.verifyMeService.verifyBvn(bvn, user.firstName, user.lastName);

      if (bvnResponse.data) {
        const formattedData = this.formatBvnResponse(bvnResponse.data);
        
        await this.bvnDataService.create({
          userId,
          bvn,
          bvnResponse: bvnResponse.data,
        });

        return {
          status: true,
          message: 'BVN details retrieved successfully',
          data: formattedData,
        };
      }
      
      throw new UnprocessableEntityException('Could not retrieve BVN details');
    } catch (error) {
      this.logger.error('Error getting BVN details:', error);
      throw new UnprocessableEntityException(error.response?.response?.data?.message || 'Could not retrieve BVN details');
    }
  }

  async getNinDetails(nin: string): Promise<any> {
    try {
      const ninResponse = await this.qoreIdService.verifyNin(nin);
      
      if (ninResponse.nin) {
        const formattedData = this.formatNinResponse(ninResponse.nin);
        return {
          status: true,
          message: 'NIN details retrieved successfully',
          data: formattedData,
        };
      }
      throw new UnprocessableEntityException('Could not verify NIN');
    } catch (error) {
      this.logger.error('Error verifying NIN:', error);
      throw new UnprocessableEntityException(error.response?.response?.data?.message || 'Could not verify NIN');
    }
  }

  async verifyBvn(bvn: string, userId: string): Promise<void> {
    try {
      const existingBvnData = await this.bvnDataService.findOne(userId);
      if (!existingBvnData) {
        throw new UnprocessableEntityException('BVN data not found. Please get BVN details first.');
      }

      await this.userRepository.update({ id: userId }, {
        bvn
      });
    } catch (error) {
      throw new UnprocessableEntityException('Could not verify BVN');
    }
  }

  async verifyNin(nin: string, userId: string): Promise<void> {
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException('User not found');
      } 

      await this.userRepository.update({ id: userId }, {
        nin
      });

    } catch (error) {
      throw new UnprocessableEntityException('Could not verify NIN');
    }
  }

  private formatBvnResponse(data: any) {
    const bvnData = data || {};
    const response: any = {
      bvn: bvnData.bvn,
    };

    const phones: string[] = [];
    if (bvnData.phone) phones.push(bvnData.phone);
    if (bvnData.phone1) phones.push(bvnData.phone1);
    if (bvnData.phone2) phones.push(bvnData.phone2);
    if (bvnData.phones && Array.isArray(bvnData.phones)) {
      phones.push(...bvnData.phones);
    }
    if (phones.length > 0) {
      response.phones = [...new Set(phones)];
    }

    const emails: string[] = [];
    if (bvnData.email) emails.push(bvnData.email);
    if (bvnData.email2) emails.push(bvnData.email2);
    if (bvnData.emails && Array.isArray(bvnData.emails)) {
      emails.push(...bvnData.emails);
    }
    if (emails.length > 0) {
      response.emails = [...new Set(emails)];
    }

    return response;
  }

  private formatNinResponse(data: any) {
    const ninData = data || {};
    const response: any = {
      nin: ninData.nin,
      firstname: ninData.firstname,
      lastname: ninData.lastname,
    };

    const phones: string[] = [];
    if (ninData.phone) phones.push(ninData.phone);
    if (phones.length > 0) {
      response.phones = [...new Set(phones)];
    }

    const emails: string[] = [];
    if (ninData.email) emails.push(ninData.email);
    if (ninData.emails && Array.isArray(ninData.emails)) {
      emails.push(...ninData.emails);
    }
    if (emails.length > 0) {
      response.emails = [...new Set(emails)]; 
    }

    return response;
  }

  private mapToResponseDto(user: User): UserResponseDto {
    const userDto = new UserResponseDto();
    Object.assign(userDto, {
      id: user.id,
      bvn: user.bvn,
      nin: user.nin,
      pen: user.pen,
      firstName: user.firstName,
      middleName: user.middleName,
      lastName: user.lastName,
      email: user.email,
      dob: user.dob,
      gender: user.gender,
      phone: user.phone,
      uuidToken: user.uuidToken,
      refCode: user.refCode,
      referrer: user.referrer,
      showBalance: user.showBalance,
      stateOfPosting: user.stateOfPosting,
      lgaOfPosting: user.lgaOfPosting,
      isEnabled: user.isEnabled,
      isLocked: user.isLocked,
      firstLogin: user.firstLogin,
      twoFactorAuth: user.twoFactorAuth,
      userRoles: user.userRoles,
      accountType: user.accountType,
      otpCodeHash: user.otpCodeHash,
      otpCodeExpiry: user.otpCodeExpiry,
      isEmailVerified: user.isEmailVerified,
      isPhoneVerified: user.isPhoneVerified,
      passwordChangedAt: user.passwordChangedAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      deletedAt: user.deletedAt,
    });
    return userDto;
  }
}