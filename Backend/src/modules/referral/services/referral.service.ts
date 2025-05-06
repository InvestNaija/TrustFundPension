import { Injectable, NotFoundException } from '@nestjs/common';
import { Referral } from '../entities/referral.entity';
import { CreateReferralDto } from '../dto/create-referral.dto';
import { ReferralRepository } from '../repositories/referral.repository';
import { UserService } from '../../user/services/user.service';

@Injectable()
export class ReferralService {
  constructor(
    private readonly referralRepository: ReferralRepository,
    private readonly userService: UserService,
  ) {}

  async generateCode(dto: CreateReferralDto): Promise<Referral> {
    const owner = await this.userService.findOne(dto.ownerId);
    if (!owner) throw new NotFoundException('Owner user not found');
    let referrer: any | undefined = undefined;
    if (dto.referrerId) {
      referrer = await this.userService.findOne(dto.referrerId) || undefined;
      if (!referrer) throw new NotFoundException('Referrer user not found');
    }
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const referral = { code, owner, referrer } as unknown as Referral;
    return this.referralRepository.save(referral);
  }

  async getMyReferralCode(userId: string): Promise<Referral> {
    const referral = await this.referralRepository.findOne({ where: { owner: { id: userId } }, relations: ['owner', 'referrer'] });
    if (!referral) throw new NotFoundException('Referral code not found');
    return referral;
  }

  async findByCode(code: string): Promise<Referral> {
    const referral = await this.referralRepository.findOne({ where: { code }, relations: ['owner', 'referrer'] });
    if (!referral) throw new NotFoundException('Referral code not found');
    return referral;
  }
} 