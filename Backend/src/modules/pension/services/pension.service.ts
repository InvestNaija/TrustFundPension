import { Injectable, UnprocessableEntityException, BadRequestException } from '@nestjs/common';
import { TrustFundService } from '../../third-party-services/trustfund';
import { UserService } from '../../user/services/user.service';
import {
  EmailRequestDto,
  SmsRequestDto,
  ContributionRequestDto,
  AccountManagerRequestDto,
  SummaryRequestDto,
  CustomerOnboardingRequestDto,
  GenerateReportQueryDto,
} from '../dto';
import { ICustomerOnboardingRequest, IEmployerRequest } from '../../third-party-services/trustfund/types';
import { IApiResponse } from 'src/core/types';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FundTransfer } from '../entities/fund-transfer.entity';
import { CreateFundTransferDto, FundTransferResponseDto } from '../dto/fund-transfer.dto';
import { plainToClass } from 'class-transformer';
import { IsNull } from 'typeorm';

@Injectable()
export class PensionService {
  constructor(
    private readonly trustFundService: TrustFundService,
    private readonly userService: UserService,
    @InjectRepository(FundTransfer)
    private readonly fundTransferRepository: Repository<FundTransfer>,
  ) {}

  async sendEmail(data: EmailRequestDto) {
    try {
      return await this.trustFundService.sendEmail(data);
    } catch (error) {
      throw new UnprocessableEntityException('Failed to send email');
    }
  }

  async sendSms(data: SmsRequestDto) {
    try {
      return await this.trustFundService.sendSms(data);
    } catch (error) {
      throw new UnprocessableEntityException('Failed to send SMS');
    }
  }

  async getFundTypes(): Promise<IApiResponse> {
    try {
      const fundTypes = await this.trustFundService.getFundTypes();
      return {
        status: true,
        message: 'Fund types retrieved successfully',
        data: fundTypes
      };
    } catch (error) {
      throw new UnprocessableEntityException('Failed to get fund types');
    }
  }

  async getEmployerDetails(data: IEmployerRequest): Promise<IApiResponse> {
    try {
      const employers = await this.trustFundService.getEmployers(data);
      return {
        status: true,
        message: 'Employers types retrieved successfully',
        data: employers
      };
    } catch (error) {
      throw new UnprocessableEntityException('Failed to get Employer details');
    }
  }

  async getLastTenContributions(userId: string): Promise<IApiResponse> {
    try {
      const user = await this.userService.findOne(userId);
      if (!user) {
        throw new UnprocessableEntityException('User not found');
      }

      const data: ContributionRequestDto = { pin: user.pen };
      const contributions = await this.trustFundService.getLastTenContributions(data);
      return {
        status: true,
        message: 'Contributions retrieved successfully',
        data: contributions
      };
    } catch (error) {
      throw new UnprocessableEntityException('Failed to get contributions');
    }
  }

  async getAccountManager(userId: string): Promise<IApiResponse> {
    try {
      const user = await this.userService.findOne(userId);
      if (!user) {
        throw new UnprocessableEntityException('User not found');
      }

      const data: AccountManagerRequestDto = { rsa_number: user.pen };
      const manager = await this.trustFundService.getAccountManager(data);
      return {
        status: true,
        message: 'Account manager retrieved successfully',
        data: manager
      };
    } catch (error) {
      throw new UnprocessableEntityException('Failed to get account manager');
    }
  }

  async getSummary(userId: string): Promise<IApiResponse> {
    try {
      const user = await this.userService.findOne(userId);
      if (!user) {
        throw new UnprocessableEntityException('User not found');
      }

      const data: SummaryRequestDto = { pin: user.pen };
      const summary = await this.trustFundService.getSummary(data);
      return {
        status: true,
        message: 'Summary retrieved successfully',
        data: summary
      };
    } catch (error) {
      throw new UnprocessableEntityException('Failed to get summary');
    }
  }

  async validateRsaPin(rsa_pin: string): Promise<IApiResponse> {
    try {
      const data: SummaryRequestDto = { pin: rsa_pin };
      const summary = await this.trustFundService.getSummary(data);
      return {
        status: true,
        message: 'RSA PIN validated successfully',
        data: summary
      };
    } catch (error) {
      throw new UnprocessableEntityException('Failed to get summary');
    }
  }

  async customerOnboarding(data: CustomerOnboardingRequestDto):Promise<IApiResponse> {
    try {
      const onboardingData: ICustomerOnboardingRequest = {
        ...data
      };

      const response = await this.trustFundService.customerOnboarding(onboardingData);
      return {
        status: true,
        message: 'Customer onboarding completed successfully',
        data: response,
      };
    } catch (error) {
      return {
        status: false,
        message: 'Failed to complete onboarding',
        data: {},
      };
    }
  }

  async generateReport(query: GenerateReportQueryDto, userId: string) {
    try {
      const user = await this.userService.findOne(userId);
      if (!user) {
        throw new UnprocessableEntityException('User not found');
      }

      const data = {
        pin: user.pen,
        fromDate: query.fromDate,
        toDate: query.toDate,
      };
      return await this.trustFundService.generateReport(data);
    } catch (error) {
      throw new UnprocessableEntityException('Failed to generate report');
    }
  }

  async generateWelcomeLetter(userId: string) {
    try {
      const user = await this.userService.findOne(userId);
      if (!user) {
        throw new UnprocessableEntityException('User not found');
      }

      const data = { pin: user.pen };
      return await this.trustFundService.generateWelcomeLetter(data);
    } catch (error) {
      throw new UnprocessableEntityException('Failed to generate welcome letter');
    }
  }

  async createPensionAccount(userId: string) {
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new UnprocessableEntityException('User not found');
    }

    const data: CustomerOnboardingRequestDto = {
      formRefno: user.pen,
      schemeId: 'DEFAULT_SCHEME',
      ssn: user.pen,
      gender: 'M',
      title: 'Mr',
      firstname: user.firstName,
      surname: user.lastName,
      maritalStatusCode: 'S',
      placeOfBirth: 'Unknown',
      mobilePhone: user.phone,
      permanentAddressLocation: 'Unknown',
      nationalityCode: 'NG',
      stateOfOrigin: 'Unknown',
      lgaCode: 'Unknown',
      permCountry: 'NG',
      permState: 'Unknown',
      permLga: 'Unknown',
      permCity: 'Unknown',
      bankName: 'Unknown',
      accountNumber: 'Unknown',
      accountName: `${user.firstName} ${user.lastName}`,
      bvn: '',
      othernames: '',
      maidenName: '',
      email: user.email,
      permanentAddress: 'Unknown',
      permBox: '',
      permanentAddress1: '',
      permZip: '',
      employerType: 'Unknown',
      employerRcno: '',
      dateOfFirstApointment: new Date().toISOString(),
      employerLocation: 'Unknown',
      employerCountry: 'NG',
      employerStatecode: 'Unknown',
      employerLga: 'Unknown',
      employerCity: 'Unknown',
      employerBusiness: 'Unknown',
      employerAddress1: 'Unknown',
      employerAddress: 'Unknown',
      employerZip: '',
      employerBox: '',
      employerPhone: '',
      nokTitle: 'Mr',
      nokName: 'Unknown',
      nokSurname: 'Unknown',
      nokGender: 'M',
      nokRelationship: 'Unknown',
      nokLocation: 'Unknown',
      nokCountry: 'NG',
      nokStatecode: 'Unknown',
      nokLga: 'Unknown',
      nokCity: 'Unknown',
      nokOthername: '',
      nokAddress1: 'Unknown',
      nokAddress: 'Unknown',
      nokZip: '',
      nokEmailaddress: '',
      nokBox: '',
      nokMobilePhone: '',
      pictureImage: '',
      formImage: '',
      signatureImage: '',
      stateOfPosting: 'Unknown',
      agentCode: '',
      dateOfBirth: new Date().toISOString(),
    };

    return await this.trustFundService.customerOnboarding(data);
  }

  async getPensionAccount(userId: string) {
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new UnprocessableEntityException('User not found');
    }

    const data = { pin: user.pen };
    return await this.trustFundService.getSummary(data);
  }

  async getPensionContributions(userId: string) {
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new UnprocessableEntityException('User not found');
    }

    const data = { pin: user.pen };
    return await this.trustFundService.getLastTenContributions(data);
  }

  async getPensionStatement(userId: string) {
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new UnprocessableEntityException('User not found');
    }

    const data = {
      pin: user.pen,
      fromDate: new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString(),
      toDate: new Date().toISOString(),
    };
    return await this.trustFundService.generateReport(data);
  }

  async getEmbassyLetterUrl(userId: string){
    try {
      const user = await this.userService.findOne(userId);
      if (!user) {
        throw new UnprocessableEntityException('User not found');
      }

      // Format date as DD-MMM-YYYY (e.g., 05-may-1981)
      const dob = new Date(user?.dob);
      const formattedDob = `${String(dob.getDate()).padStart(2, '0')}-${dob.toLocaleString('en-US', { month: 'short' }).toLowerCase()}-${dob.getFullYear()}`;

      return await this.trustFundService.generateEmbassyLetterUrl({
        surname: user?.lastName,
        mobile: user?.phone,
        dateOfBirth: formattedDob
      });
    } catch (error) {
      throw new UnprocessableEntityException('Failed to generate embassy letter');
    }
  }

  private getEligibleFundType(age: number): string {
    if (age >= 60) {
      return '7';
    } else if (age >= 50 && age < 60) {
      return '55';
    } else if (age < 50) { 
      return '1';
    }
    return '1';
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
    if (!user) {
      throw new BadRequestException('User not found');
    }
    
    const adminEmail = process.env.ADMIN_EMAIL || 'olaoluofficial@gmail.com';
    if (!adminEmail) {
      throw new BadRequestException('Admin email not configured');
    }

    await this.trustFundService.sendEmail({
      to: adminEmail,
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

  async createFundTransfer(userId: string, dto: CreateFundTransferDto): Promise<IApiResponse> {
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Check for existing pending request
    const existingRequest = await this.fundTransferRepository.findOne({
      where: {
        userId,
        isApproved: false,
        deletedAt: IsNull()
      }
    });

    if (existingRequest) {
      throw new BadRequestException('You already have a pending fund transfer request. Please wait for it to be processed.');
    }

    const age = this.calculateAge(new Date(user.dob));
    const eligibleFund = this.getEligibleFundType(age);

    if (dto.aspiringFund !== eligibleFund) {
      throw new BadRequestException(`You are only eligible for Fund ${eligibleFund} based on your age`);
    }

    const transfer = await this.fundTransferRepository.save({
      userId,
      currentFund: dto.currentFund,
      aspiringFund: dto.aspiringFund,
      isApproved: false,
    });

    await this.notifyAdmin(userId, dto.currentFund, dto.aspiringFund);

    return {
      status: true,
      message: 'Fund transfer request created successfully',
      data: plainToClass(FundTransferResponseDto, transfer, {
        excludeExtraneousValues: true,
      }),
    };
  }
} 