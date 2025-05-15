import { Injectable, UnprocessableEntityException } from '@nestjs/common';
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
import { ICustomerOnboardingRequest } from '../../third-party-services/trustfund/types';
import { IApiResponse } from 'src/core/types';

@Injectable()
export class PensionService {
  constructor(
    private readonly trustFundService: TrustFundService,
    private readonly userService: UserService,
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

  async getEmployerDetails(): Promise<IApiResponse> {
    try {
      const employers = await this.trustFundService.getEmployers();
      return {
        status: true,
        message: 'Employers types retrieved successfully',
        data: employers
      };
    } catch (error) {
      throw new UnprocessableEntityException('Failed to get fund types');
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
} 