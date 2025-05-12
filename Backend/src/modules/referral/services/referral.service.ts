import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Referral } from '../entities';
import { CreateReferralDto, UpdateReferralDto } from '../dto';
import { UserService } from '../../user/services';
import { User } from '../../user/entities';
import { ReferralRepository } from '../repositories';
@Injectable()
export class ReferralService {
  constructor(
    @InjectRepository(Referral)
    private readonly referralRepository: ReferralRepository,
    private readonly userService: UserService,
  ) {}

  async create(createReferralDto: CreateReferralDto): Promise<Referral> {
    const owner = await this.userService.findOne(createReferralDto.owner) as User;
    if (!owner) {
      throw new NotFoundException('Owner user not found');
    }

    let referrer: User | undefined;
    if (createReferralDto.referrer) {
      referrer = await this.userService.findOne(createReferralDto.referrer) as User || undefined;
    }

    const referral = this.referralRepository.save({
      code: createReferralDto.code,
      owner,
      referrer,
    });

    return referral;
  }

  async findAll(ownerId: string): Promise<Referral[]> {
    return this.referralRepository.find({
      where: { owner: { id: ownerId } },
      relations: ['owner', 'referrer'],
    });
  }

  async findOne(id: string): Promise<Referral> {
    const referral = await this.referralRepository.findOne({
      where: { id },
      relations: ['owner', 'referrer'],
    });

    if (!referral) {
      throw new NotFoundException(`Referral with ID ${id} not found`);
    }

    return referral;
  }

  async update(id: string, updateReferralDto: UpdateReferralDto, ownerId: string): Promise<Referral> {
    const referral = await this.findOne(id);

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

    return this.referralRepository.save(referral);
  }

  async remove(id: string, ownerId: string): Promise<void> {
    const referral = await this.findOne(id);

    if (referral.owner.id !== ownerId) {
      throw new NotFoundException('You can only delete your own referrals');
    }

    await this.referralRepository.delete({ id: referral.id });
  }
} 