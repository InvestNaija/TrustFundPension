import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FundTransfer } from '../entities/fund-transfer.entity';
import { CreateFundTransferDto, FundTransferResponseDto } from '../dto/fund-transfer.dto';
import { UserService } from '../../user/services/user.service';
import { TrustFundService } from '../../third-party-services/trustfund';
import { plainToClass } from 'class-transformer';

@Injectable()
export class FundTransferService {
  private readonly logger = new Logger(FundTransferService.name);

  constructor(
    @InjectRepository(FundTransfer)
    private readonly fundTransferRepository: Repository<FundTransfer>,
    private readonly userService: UserService,
    private readonly trustFundService: TrustFundService,
  ) {}

  private getEligibleFundType(age: number): string {
    if (age >= 60) {
      return '7'; // TRUSTFUND RSA FUND 4
    } else if (age >= 50 && age < 60) {
      return '55'; // TRUSTFUND RSA FUND 3
    } else if (age < 50) {
      return '1'; // TRUSTFUND RSA FUND 2
    }
    return '1'; // Default to TRUSTFUND RSA FUND 2
  }

  private async validateFundTransfer(userId: string, currentFund: string, aspiringFund: string): Promise<void> {
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const age = this.calculateAge(new Date(user.dob));
    // const yearsInService = this.calculateYearsInService(user.employmentDate);

    const eligibleFund = this.getEligibleFundType(age);

    if (aspiringFund !== eligibleFund) {
      throw new BadRequestException(`You are only eligible for Fund ${eligibleFund} based on your age`);
    }
  }

  private calculateAge(dob: Date): number {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }

  private async notifyAdmin(userId: string, currentFund: string, aspiringFund: string): Promise<void> {
    const user = await this.userService.findOne(userId);
    
    await this.trustFundService.sendEmail({
      to: process.env.ADMIN_EMAIL || 'olaoluofficia@gmail.com',
      subject: 'New Fund Transfer Request',
      body: `
        A new fund transfer request has been submitted:
        User: ${user.firstName} ${user.lastName}
        Current Fund: ${currentFund}
        Aspiring Fund: ${aspiringFund}
        Please review and approve/reject this request.
      `,
    });
  }

  async createTransfer(userId: string, dto: CreateFundTransferDto): Promise<FundTransferResponseDto> {
    await this.validateFundTransfer(userId, dto.currentFund, dto.aspiringFund);

    const transfer = this.fundTransferRepository.create({
      userId,
      currentFund: dto.currentFund,
      aspiringFund: dto.aspiringFund,
      isApproved: false,
    });

    const savedTransfer = await this.fundTransferRepository.save(transfer);
    await this.notifyAdmin(userId, dto.currentFund, dto.aspiringFund);

    return plainToClass(FundTransferResponseDto, savedTransfer, {
      excludeExtraneousValues: true,
    });
  }
} 