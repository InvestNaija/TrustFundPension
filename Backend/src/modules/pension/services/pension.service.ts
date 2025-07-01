import { Injectable, UnprocessableEntityException, BadRequestException, Logger } from '@nestjs/common';
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
import { getLgaCode, getStateCode } from 'src/shared/utils/nigeria-location-codes.util';
import * as https from 'https';
import * as http from 'http';
import * as sharp from 'sharp';

@Injectable()
export class PensionService {
  private readonly logger = new Logger(PensionService.name);

  constructor(
    private readonly trustFundService: TrustFundService,
    private readonly userService: UserService,
    @InjectRepository(FundTransfer)
    private readonly fundTransferRepository: Repository<FundTransfer>,
    @InjectRepository(BVNData)
    private readonly bvnDataRepository: Repository<BVNData>,
  ) {}

  // Helper function to convert URL to base64 with compression
  private async urlToBase64(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const protocol = url.startsWith('https') ? https : http;

      protocol.get(url, (response) => {
        if (response.statusCode !== 200) {
          return reject(new Error(`Failed to fetch image: Status ${response.statusCode}`));
        }

        const chunks: Buffer[] = [];
        response.on('data', (chunk) => chunks.push(chunk));

        response.on('end', async () => {
          try {
            const buffer = Buffer.concat(chunks);

            const compressedBuffer = await sharp(buffer)
              .resize(150, 150, { fit: 'inside', withoutEnlargement: true })
              .jpeg({ quality: 30, progressive: true })
              .toBuffer();

            const base64 = compressedBuffer.toString('base64');

            // Optionally prefix with MIME type for full compatibility
            const prefixedBase64 = `data:image/jpeg;base64,${base64}`;

            resolve(base64); // or resolve(prefixedBase64) if your API needs the prefix
          } catch (err) {
            reject(new Error(`Image processing failed: ${err.message}`));
          }
        });

        response.on('error', (err) => {
          reject(new Error(`Image download stream error: ${err.message}`));
        });
      }).on('error', (err) => {
        reject(new Error(`Request error: ${err.message}`));
      });
    });
  }

  // Helper function to get base64 image with fallback
  private async getBase64Image(url: string | null, fallbackBase64: string): Promise<string> {
    if (!url) {
      return fallbackBase64;
    }

    try {
      return await this.urlToBase64(url);
    } catch (error) {
      this.logger.warn(`Failed to convert image from URL: ${url} - ${error.message}`);
      return fallbackBase64;
    }
  }

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

  async getEmbassyLetter(userId: string, embassyId: number): Promise<Buffer> {
    try {
      const user = await this.userService.findOne(userId);
      if (!user) {
        throw new UnprocessableEntityException('User not found');
      }

      return await this.trustFundService.getEmbassyLetter({
        pin: user.pen,
        embassyId
      });
    } catch (error) {
      this.logger.error('Error generating embassy letter:', error);
      throw new UnprocessableEntityException('Could not generate embassy letter');
    }
  }

  async getEmbassy(): Promise<IApiResponse> {
    try {
      const embassies = await this.trustFundService.getEmbassy();
      return {
        status: true,
        message: 'Embassies retrieved successfully',
        data: embassies
      };
    } catch (error) {
      this.logger.error('Error getting embassies:', error);
      throw new UnprocessableEntityException('Could not get embassies');
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

  async getSignedNotFunded(): Promise<IApiResponse> {
    const data = await this.trustFundService.getSignedNotFunded();
    return { status: true, message: 'Data fetched successfully', data };
  }
  
  async getRSARegisteredYearFunded(): Promise<IApiResponse> {
    const data = await this.trustFundService.getRSARegisteredYearFunded();
    return { status: true, message: 'Data fetched successfully', data };
  }
  
  async getRSANotFundedByEndLastYearFundedThisYear(): Promise<IApiResponse> {
    const data = await this.trustFundService.getRSANotFundedByEndLastYearFundedThisYear();
    return { status: true, message: 'Data fetched successfully', data };
  }
  
  async getRSANotFundedAtLeastFourYrs(): Promise<IApiResponse> {
    const data = await this.trustFundService.getRSANotFundedAtLeastFourYrs();
    return { status: true, message: 'Data fetched successfully', data };
  }
  
  async getFundPricesPercentageGrowthDuringYear(): Promise<IApiResponse> {
    const data = await this.trustFundService.getFundPricesPercentageGrowthDuringYear();
    return { status: true, message: 'Data fetched successfully', data };
  }

  async completeOnboarding(userId: string): Promise<IApiResponse> {
    try {
      const user = await this.userService.findOneUser(userId);
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
      if (!nok || !nok.addresses?.[0]) {
        throw new BadRequestException('Next of Kin address is required');
      }

      const employer = user.employers?.[0];
      if (!employer || !employer.addresses?.[0]) {
        throw new BadRequestException('Employer address is required');
      }

      const nokAddress = nok.addresses?.[0];
      const employerAddress = employer.addresses?.[0];

      let formattedDob;
      if (user.dob) {
        const yyyyMMddRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (yyyyMMddRegex.test(user.dob)) {
          formattedDob = user.dob;
        } else {
          const [day, month, year] = user.dob.split('-');
          if (day && month && year) {
            formattedDob = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
          } else {
            throw new BadRequestException('Invalid date of birth format. Expected DD-MM-YYYY or YYYY-MM-DD');
          }
        }
      } else {
        throw new BadRequestException('Date of birth is required');
      }

      // Convert user media URLs to base64
      const fallbackImage = 'iVBORw0KGgoAAAANSUhEUgAAAHIAAAASCAYAAACHKYonAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsIAAA7CARUoSoAAAA/HSURBVGhDxVkHdFVVuv7OufcmN4UUIkEgRghESJBgaEIojggCT1DmsbCM88QyIsqs0QEpFvA9cZQXxGlSw6KDrAEiHRELQhAQEupESAiEHpJQ0m6/57zv3zcnlOfzsd48hj/rv/ucXf6z99//He3q1avmli1bEBYWhjsN4eHhsNls9W/XQCOaocfbBoFAAD6fTz0PHToU+/fvx4kTJ35yPzeAxt3pOhu2gtypaXC3hsHHW9m1rNNDqIBrZJ3J9f/LqU3OczqdGDRoELRly5aZycnJSEpKUgOC/0wQBsg34+LisCMvD2fPnEW4PRzBYBC6ZsJl8yNgc0D322DTgxC2hgVsMOCBYdP5zmfhxT+wbRFiWloaMjMzsXjxYjz55JOYNm0aJk6cCJfLVT9LgB9RQrNBj3BCj4wkv4Pwl1+Er6oGAY8PdocDdp7F0TQedrsTQbeL6AYPROEKDRE8T8ExzSbr3TDcl2H6amAE';

      // Get the first media file from user's media array
      const firstMedia = user.media?.[0];
      
      // Convert the first media file to base64 for all three image fields
      const pictureImage = await this.getBase64Image(
        firstMedia?.file_url || null,
        fallbackImage
      );

      let maritalStatusCode;
      switch (bvnData.bvnResponse.marital_status.toLowerCase()) {
        case 'Single':
          maritalStatusCode = 'SG';
          break;
        case 'Married':
          maritalStatusCode = 'MD';
          break;
        case 'Divorced':
          maritalStatusCode = 'DV';
          break;
        case 'Widowed':
          maritalStatusCode = 'WD';
          break;
        case 'Separated':
          maritalStatusCode = 'SP';
          break;
        default:
          maritalStatusCode = 'SG';
          break;
      }

      let title;
      switch (bvnData.bvnResponse.title.toLowerCase()) {
        case 'Mr':
          title = 'Mr';
          break;
        case 'Mrs':
          title = 'Mrs';
          break;
        case 'Miss':
          title = 'Miss';
          break;
        case 'Ms':
          title = 'Ms';
          break;
        default:
          title = 'Mr';
          break;
      }

      // TODO - Update getStateCode and getLgaCode to use the new API

      const onboardingRequest: ICustomerOnboardingRequest = {
        formRefno: `ONB${user.lastName.toUpperCase().slice(0, 3)}${Date.now().toString().slice(-6)}`,
        schemeId: '12',
        ssn: user.nin,
        title,
        surname: user.lastName,
        firstname: user.firstName,
        othernames: user.middleName || '',
        gender: user.gender.toLowerCase() === 'male' ? 'm' : 'f',
        dateOfBirth: formattedDob,
        maritalStatusCode,
        mobilePhone: user.phone.replace('+', ''),
        email: user.email,
        permanentAddress: bvnData.bvnResponse.residential_address.substring(0, 40) || '',
        permanentAddressLocation: bvnData.bvnResponse.nationality.toLowerCase() === 'nigeria' ? 'N' : 'A',
        permState: getStateCode(bvnData.bvnResponse.state_of_residence.split(' ')[0]) || '',
        permLga: getLgaCode(bvnData.bvnResponse.state_of_residence.split(' ')[0], bvnData.bvnResponse.lga_of_residence) || "LGA",
        bankName: '',
        accountNumber: '',
        accountName: `${user.firstName} ${user.lastName}`,
        bvn: user.bvn,
        employerType: employer.rcNumber.substring(0, 2),
        employerRcno: employer.rcNumber,
        dateOfFirstApointment: new Date().toISOString().split('T')[0],
        employerLocation: employerAddress.countryCode === 'NG' ? 'N' : 'A',
        employerCountry: employerAddress.countryCode,
        employerStatecode: getStateCode(employerAddress.state) || '',
        employerLga: getLgaCode(employerAddress.state, employerAddress.city) || "LGA",
        employerCity: employerAddress.city,
        employerBusiness: employer.natureOfBusiness,
        employerAddress1: employerAddress.streetName,
        employerAddress: employerAddress.streetName,
        employerZip: employerAddress.zipCode,
        employerBox: employerAddress.houseNumber,
        employerPhone: employer.phoneNumber.replace('+', ''),
        nokTitle: nok.gender.toLowerCase() === 'male' ? 'Mr' : 'Mrs',
        nokName: nok.firstName + ' ' + nok.lastName,
        nokSurname: nok.lastName,
        nokGender: nok.gender.toLowerCase() === 'male' ? 'm' : 'f',
        nokRelationship:  nok.relationship,
        nokLocation: nokAddress.countryCode === 'NG' ? 'N' : 'A',
        nokCountry: nokAddress.countryCode,
        nokStatecode: getStateCode(nokAddress.state) || '',
        nokLga: getLgaCode(nokAddress.state, nokAddress.city) || "LGA",
        nokCity: nokAddress.city,
        nokOthername: nok.middleName,
        nokAddress1: nokAddress.streetName,
        nokAddress: nokAddress.streetName,
        nokZip: nokAddress.zipCode,
        nokEmailaddress: nok.email,
        nokBox: nokAddress.houseNumber,
        nokMobilePhone: nok.phone.replace('+', ''),
        pictureImage: pictureImage,
        formImage: pictureImage,
        signatureImage: pictureImage,
        placeOfBirth: bvnData.bvnResponse.state_of_origin.split(' ')[0],
        nationalityCode: 'NG',
        stateOfOrigin: getStateCode(bvnData.bvnResponse.state_of_origin.split(' ')[0]) || '',
        lgaCode: getLgaCode(bvnData.bvnResponse.state_of_origin.split(' ')[0], bvnData.bvnResponse.lga_of_origin) || "LGA",
        permCountry: 'NG',
        permCity: bvnData.bvnResponse.lga_of_residence || '',
        permBox: '234',
        permanentAddress1: bvnData.bvnResponse.residential_address.substring(0, 40) || '',
        permZip: '',
        stateOfPosting: getStateCode(bvnData.bvnResponse.state_of_residence.split(' ')[0]) || '',
        agentCode: '1234567',
        maidenName: '',
      };

      const response = await this.trustFundService.customerOnboarding(onboardingRequest);

      if (response.errorCode === "success") {
        await this.userService.update(userId, {
          isOnboarded: true,
          onboardingDate: new Date(),
        });

        return {
          status: true,
          message: 'Customer onboarding completed successfully',
          data: response,
        };
      } else {
        throw new BadRequestException(response.errorMessages || 'Onboarding failed');
      }
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