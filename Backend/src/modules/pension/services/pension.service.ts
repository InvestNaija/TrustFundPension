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
import { BVNData } from '../../user/entities';

@Injectable()
export class PensionService {
  constructor(
    private readonly trustFundService: TrustFundService,
    private readonly userService: UserService,
    @InjectRepository(FundTransfer)
    private readonly fundTransferRepository: Repository<FundTransfer>,
    @InjectRepository(BVNData)
    private readonly bvnDataRepository: Repository<BVNData>,
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

  async generateUnremittedContributions(query: GenerateReportQueryDto, userId: string) {
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
      return await this.trustFundService.generateUnremittedContributions(data);
    } catch (error) {
      throw new UnprocessableEntityException('Failed to generate unremitted contributions');
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

  async completeOnboarding(userId: string): Promise<IApiResponse> {
    try {
      const user = await this.userService.findOne(userId);
      if (!user) {
        throw new BadRequestException('User not found');
      }

      if (user.isOnboarded) {
        throw new BadRequestException('User is already onboarded');
      }

      const bvnData = await this.bvnDataRepository.findOne({
        select: ['id', 'bvnResponse'],
        where: {
          bvn: user.bvn
        }
      });
      if (!bvnData) {
        throw new BadRequestException('BVN data not found');
      }

      if (!user.firstName || !user.lastName || !user.gender || !user.dob || !user.phone || 
          !user.email || !user.stateOfPosting || !user.lgaOfPosting || !user.bvn || !user.noks || !user.employers) {
        throw new BadRequestException('Please complete your profile information before onboarding');
      }

      const nok = user.noks?.[0];
      if (!nok.addresses?.[0]) {
        throw new BadRequestException('Next of Kin address is required');
      }

      const employer = user.employers?.[0];
      if (!employer.addresses?.[0]) {
        throw new BadRequestException('Employer address is required');
      }

      const nokAddress = nok.addresses?.[0];
      const employerAddress = employer.addresses?.[0];

      const onboardingRequest: ICustomerOnboardingRequest = {
        formRefno: `ONB-${Date.now()}`,
        schemeId: '1',
        ssn: '1',
        title: user.gender.toLowerCase() === 'male' ? 'Mr' : 'Mrs',
        surname: user.lastName,
        firstname: user.firstName,
        othernames: user.middleName || '',
        gender: user.gender,
        dateOfBirth: user.dob,
        maritalStatusCode: 'Single',
        mobilePhone: user.phone,
        email: user.email,
        permanentAddress: bvnData.bvnResponse.residential_address || '',
        permanentAddressLocation: bvnData.bvnResponse.residential_address || '',
        permState: bvnData.bvnResponse.state_of_residence || '',
        permLga: bvnData.bvnResponse.lga_of_residence || '',
        bankName: '',
        accountNumber: '',
        accountName: `${user.firstName} ${user.lastName}`,
        bvn: user.bvn,
        employerType: 'Private',
        employerRcno: employer.rcNumber,
        dateOfFirstApointment: new Date().toISOString().split('T')[0],
        employerLocation: employerAddress.streetName,
        employerCountry: employerAddress.countryCode,
        employerStatecode: employerAddress.state,
        employerLga: employerAddress.lgaCode,
        employerCity: employerAddress.city,
        employerBusiness: employer.natureOfBusiness || '',
        employerAddress1: employerAddress.streetName || '',
        employerAddress: employerAddress.streetName || '',
        employerZip: employerAddress.zipCode || '',
        employerBox: employerAddress.houseNumber || '',
        employerPhone: employer.phoneNumber || '',
        nokTitle: nok.gender.toLowerCase() === 'male' ? 'Mr' : 'Mrs',
        nokName: nok.firstName + ' ' + nok.lastName,
        nokSurname: nok.lastName,
        nokGender: nok.gender,
        nokRelationship: nok.relationship,
        nokLocation: nokAddress.streetName || '',
        nokCountry: nokAddress.countryCode || '',
        nokStatecode: nokAddress.state || '',
        nokLga: nokAddress.lgaCode || '',
        nokCity: nokAddress.city || '',
        nokOthername: nok.middleName || '',
        nokAddress1: nokAddress.streetName || '',
        nokAddress: nokAddress.streetName || '',
        nokZip: nokAddress.zipCode || '',
        nokEmailaddress: nok.email || '',
        nokBox: nokAddress.houseNumber || '',
        nokMobilePhone: nok.phone || '',
        pictureImage: '',
        formImage: '',
        signatureImage: '',
        placeOfBirth: bvnData.bvnResponse.place_of_birth || '',
        nationalityCode: 'NGA',
        stateOfOrigin: bvnData.bvnResponse.state_of_origin || '',
        lgaCode: bvnData.bvnResponse.lga_of_origin || '',
        permCountry: 'NG',
        permCity: bvnData.bvnResponse.lga_of_residence || '',
        permBox: '',
        permanentAddress1: bvnData.bvnResponse.residential_address || '',
        permZip: '',
        stateOfPosting: bvnData.bvnResponse.state_of_residence || '',
        agentCode: '1',
        maidenName: '',
      };

      const response = await this.trustFundService.customerOnboarding(onboardingRequest);

      await this.userService.update(userId, {
        isOnboarded: true,
        onboardingDate: new Date(),
      });

      return {
        status: true,
        message: 'Customer onboarding completed successfully',
        data: response,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new UnprocessableEntityException(
        error.response?.message || 'Failed to complete customer onboarding',
      );
    }
  }
} 