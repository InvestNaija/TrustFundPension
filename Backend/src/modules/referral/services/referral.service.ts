import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Referral } from '../entities';
import { CreateReferralDto, UpdateReferralDto } from '../dto';
import { UserService } from '../../user/services';
import { User } from '../../user/entities';
import { ReferralRepository } from '../repositories';
import { IApiResponse } from 'src/shared/types';
import { generateReferralCode } from 'src/shared/utils/referral.util';

@Injectable()
export class ReferralService {
  constructor(
    @InjectRepository(Referral)
    private readonly referralRepository: ReferralRepository,
    private readonly userService: UserService,
  ) {}

  async validateAndFindReferralCode(code: string): Promise<Referral> {
    const referral = await this.referralRepository.findOne({
      where: { code },
      relations: ['owner'],
    });

    if (!referral) {
      throw new BadRequestException('Invalid referral code');
    }

    return referral;
  }

  async generateAndCreateReferral(userId: string): Promise<IApiResponse> {
    // Check if user already has a referral code
    const existingReferral = await this.referralRepository.findOne({
      where: { owner: { id: userId } }
    });

    if (existingReferral) {
      return {
        status: true,
        message: 'User already has a referral code',
        data: existingReferral
      };
    }

    // Generate a unique referral code
    let referralCode = generateReferralCode();
    let isUnique = false;
    
    while (!isUnique) {
      // Check if code already exists
      const existingReferral = await this.referralRepository.findOne({
        where: { code: referralCode }
      });
      if (!existingReferral) {
        isUnique = true;
      } else {
        referralCode = generateReferralCode();
      }
    }

    // Create the referral
    const referral = await this.referralRepository.save({
      code: referralCode,
      owner: { id: userId } as User,
    });

    return {
      status: true,
      message: 'Referral code generated successfully',
      data: referral
    };
  }

  async create(createReferralDto: CreateReferralDto): Promise<IApiResponse> {
    const owner = await this.userService.findOne(createReferralDto.owner) as User;
    if (!owner) {
      throw new NotFoundException('Owner user not found');
    }

    let referrer: User | undefined;
    if (createReferralDto.referrer) {
      referrer = await this.userService.findOne(createReferralDto.referrer) as User || undefined;
    }

    const referral = await this.referralRepository.save({
      code: createReferralDto.code,
      owner,
      referrer,
    });

    return {
      status: true,
      message: 'Referral created successfully',
      data: referral
    };
  }

  async findAll(ownerId: string): Promise<IApiResponse> {
    const referrals = await this.referralRepository.find({
      where: { owner: { id: ownerId } },
      relations: ['owner', 'referrer'],
    });

    return {
      status: true,
      message: 'Referrals retrieved successfully',
      data: referrals
    };
  }

  async findOne(id: string): Promise<IApiResponse> {
    const referral = await this.referralRepository.findOne({
      where: { id },
      relations: ['owner', 'referrer'],
    });

    if (!referral) {
      throw new NotFoundException(`Referral with ID ${id} not found`);
    }

    return {
      status: true,
      message: 'Referral retrieved successfully',
      data: referral
    };
  }

  async findReferralEntity(id: string): Promise<Referral> {
    const referral = await this.referralRepository.findOne({
      where: { id },
      relations: ['owner', 'referrer'],
    });

    if (!referral) {
      throw new NotFoundException(`Referral with ID ${id} not found`);
    }

    return referral;
  }

  async update(id: string, updateReferralDto: UpdateReferralDto, ownerId: string): Promise<IApiResponse> {
    const referral = await this.findReferralEntity(id);

    if (referral.owner.id !== ownerId) {
      throw new NotFoundException('You can only update your own referrals');
    }

    let owner = referral.owner;
    if (updateReferralDto.owner) {
      owner = await this.userService.findOne(updateReferralDto.owner) as User;
      if (!owner) {
        throw new NotFoundException('Owner user not found');
      }
    }

    let referrer = referral.referrer;
    if (updateReferralDto.referrer) {
      referrer = await this.userService.findOne(updateReferralDto.referrer) as User || undefined;
    }

    Object.assign(referral, {
      code: updateReferralDto.code,
      owner,
      referrer,
    });

    const updatedReferral = await this.referralRepository.save(referral);
    
    return {
      status: true,
      message: 'Referral updated successfully',
      data: updatedReferral
    };
  }

  async remove(id: string, ownerId: string): Promise<IApiResponse> {
    const referral = await this.findReferralEntity(id);

    if (referral.owner.id !== ownerId) {
      throw new NotFoundException('You can only delete your own referrals');
    }

    await this.referralRepository.delete({ id: referral.id });
    
    return {
      status: true,
      message: 'Referral deleted successfully',
      data: {}
    };
  }
} 