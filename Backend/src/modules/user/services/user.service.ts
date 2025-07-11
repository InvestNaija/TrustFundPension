import {
    Injectable,
    Logger,
    NotFoundException,
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
import { Like, Repository } from 'typeorm';
import { BVNData, UserRole } from '../entities';
import { BvnDataService } from './bvn-data.service';
import { UserRoleService } from './user-role.service';
import { IApiResponse } from 'src/core/types';
import { UPLOAD_TYPE } from 'src/core/constants';
import { ListUsersDto } from '../dto';
import { PageDto } from '../../../shared/dto';
import { PageMetaDto } from '../../../shared/dto';

import * as bcrypt from 'bcrypt';

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

  async listUsers(query: ListUsersDto): Promise<IApiResponse> {
    const { users, pageMeta } =
      await this.findUsers(query);

    return {
      status: true,
      message: 'Users fetched successfully',
      data: new PageDto(users, pageMeta),
    };
  }

  async findUsers(
      query: ListUsersDto,
    ): Promise<{ users: User[]; pageMeta: PageMetaDto }> {
      const {
        page,
        limit,
        skip,
        search,
        startDate,
        endDate,
        onboardingDate,
        firstName,
        lastName,
        pen,
        phone,
        isOnboarded,
        bvn,
        isEmailVerified,
        isPhoneVerified,
        email,
        middleName,
        isDeleted
      } = query;
  
      // Create query builder
      const queryBuilder = this.userRepository.createQueryBuilder('user');
  
      // Filters
      if (isDeleted) {
        queryBuilder.withDeleted().andWhere('user.deletedAt IS NOT NULL'); // Retrieve soft-deleted users only
      }
  
      if (firstName) {
        queryBuilder.andWhere('user.firstName >= :firstName', { firstName });
      }
  
      if (lastName) {
        queryBuilder.andWhere('user.lastName <= :lastName', { lastName });
      }
  
      if (middleName) {
        queryBuilder.andWhere('user.middleName >= :middleName', { middleName });
      }
  
      if (isEmailVerified) {
        queryBuilder.andWhere('user.isEmailVerified <= :isEmailVerified', { isEmailVerified });
      }
  
      if (isOnboarded) {
        queryBuilder.andWhere('user.isOnboarded <= :isOnboarded', { isOnboarded });
      }
  
      if (isPhoneVerified) {
        queryBuilder.andWhere('user.isPhoneVerified <= :isPhoneVerified', { isPhoneVerified });
      }
  
      if (email) {
        queryBuilder.andWhere('user.email >= :email', { email });
      }
  
      if (bvn) {
        queryBuilder.andWhere('user.bvn <= :bvn', { bvn });
      }
  
      if (phone) {
        queryBuilder.andWhere('user.phone >= :phone', { phone });
      }
  
      if (pen) {
        queryBuilder.andWhere('user.pen <= :pen', { pen });
      }
  
      if (startDate || endDate) {
        const start = startDate || endDate;
        const end = endDate || startDate;
  
        if (start && end) {
          const dateTimeStart = new Date(new Date(start).setHours(0, 0, 0, 0));
          const dateTimeEnd = new Date(new Date(end).setHours(23, 59, 59, 999));
  
          queryBuilder.andWhere(
            'user.createdAt BETWEEN :dateTimeStart AND :dateTimeEnd',
            { dateTimeStart, dateTimeEnd },
          );
        }
      }
  
      if (onboardingDate) {
        const dateTimeStart = new Date(new Date(onboardingDate).setHours(0, 0, 0, 0));
        const dateTimeEnd = new Date(new Date(onboardingDate).setHours(23, 59, 59, 999));
  
        queryBuilder.andWhere(
          'user.onboardingDate BETWEEN :dateTimeStart AND :dateTimeEnd',
          { dateTimeStart, dateTimeEnd },
        );
      }
  
      // Handle search across multiple fields
      if (search) {
        queryBuilder.andWhere(
          '(user.firstName ILIKE :search OR user.lastName ILIKE :search OR user.email ILIKE :search OR user.middleName ILIKE :search)',
          { search: `%${search}%` },
        );
      }
  
      // Sorting
      queryBuilder.orderBy('user.createdAt', 'DESC');

      // Add relations
      queryBuilder
        .leftJoinAndSelect('user.employers', 'employers')
        .leftJoinAndSelect('user.noks', 'noks')
        .leftJoinAndSelect('user.referrals', 'referrals')
        .leftJoinAndSelect('user.referred', 'referred')
        .leftJoinAndSelect('user.media', 'media');
  
      // Pagination
      const total = await queryBuilder.getCount();
      const users = await queryBuilder.skip(skip).take(limit).getMany();
      const meta = new PageMetaDto({
        itemCount: total,
        pageOptionsDto: { page, skip, limit },
      });
  
      return { users, pageMeta: meta };
    }

  async findOneUser(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ 
      where: { id },
      relations: [
        'employers',
        // 'userRole',
        // 'bvnData',
        'noks',
        'referrals',
        'referred',
        'media'
      ],
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ 
      where: { id },
      relations: [
        'media'
      ],
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
    
    const user = await this.findOneUser(id);
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
    return this.userRepository.findOne({ where: { phone: Like(`%${phone}%`) } });
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
      
      if (existingBvnData && 'bvnResponse' in existingBvnData) {
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

      const bvnResponse = await this.qoreIdService.verifyBvn(bvn);

      if (bvnResponse) {
        const formattedData = this.formatBvnResponse(bvnResponse.bvn);
        
        await this.bvnDataService.create({
          userId,
          bvn,
          bvnResponse: bvnResponse.bvn,
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
      if (!existingBvnData || !('bvnResponse' in existingBvnData)) {
        throw new UnprocessableEntityException('BVN data not found. Please get BVN details first.');
      }

      await this.userRepository.update({ id: userId }, {
        bvn,
        gender: existingBvnData.bvnResponse.gender,
        dob: existingBvnData.bvnResponse.birthdate,
        stateOfPosting: existingBvnData.bvnResponse.state_of_residence,
        lgaOfPosting: existingBvnData.bvnResponse.lga_of_residence,
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

  async changePassword(userId: string, dto: { oldPassword: string; newPassword: string }): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (!user.password) {
      throw new BadRequestException('Password not set for this user');
    }
    const isMatch = await bcrypt.compare(dto.oldPassword, user.password);
    if (!isMatch) {
      throw new BadRequestException('Old password is incorrect');
    }
    const hashed = await bcrypt.hash(dto.newPassword, 10);
    user.password = hashed;
    const updatedUser = await this.userRepository.save(user);
    return this.mapToResponseDto(updatedUser);
  }

  async updateFcmToken(userId: string, fcmToken: string): Promise<void> {
    await this.userRepository.update({ id: userId }, { fcmToken });
  }

  private formatBvnResponse(data: any) {
    const bvnData = data || {};
    const response: any = {
      bvn: bvnData.bvn,
      firstname: bvnData.firstname,
      lastname: bvnData.lastname
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