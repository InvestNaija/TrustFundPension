import { Test, TestingModule } from '@nestjs/testing';
import { PensionService } from './pension.service';
import { TrustFundService } from '../../third-party-services/trustfund/trustfund.service';
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
import { UnprocessableEntityException } from '@nestjs/common';

describe('PensionService', () => {
  let service: PensionService;
  let trustFundService: TrustFundService;
  let userService: UserService;

  const mockTrustFundService = {
    sendEmail: jest.fn(),
    sendSms: jest.fn(),
    getFundTypes: jest.fn(),
    getLastTenContributions: jest.fn(),
    getAccountManager: jest.fn(),
    getSummary: jest.fn(),
    customerOnboarding: jest.fn(),
    generateReport: jest.fn(),
    generateWelcomeLetter: jest.fn(),
  };

  const mockUserService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PensionService,
        {
          provide: TrustFundService,
          useValue: mockTrustFundService,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    service = module.get<PensionService>(PensionService);
    trustFundService = module.get<TrustFundService>(TrustFundService);
    userService = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendEmail', () => {
    const emailDto: EmailRequestDto = {
      to: 'test@example.com',
      subject: 'Test Subject',
      body: 'Test Body',
    };

    it('should send email successfully', async () => {
      const mockResponse = { success: true };
      mockTrustFundService.sendEmail.mockResolvedValue(mockResponse);

      const result = await service.sendEmail(emailDto);

      expect(result).toEqual(mockResponse);
      expect(mockTrustFundService.sendEmail).toHaveBeenCalledWith(emailDto);
    });

    it('should throw UnprocessableEntityException when email sending fails', async () => {
      const error = new Error('Failed to send email');
      mockTrustFundService.sendEmail.mockRejectedValue(error);

      await expect(service.sendEmail(emailDto)).rejects.toThrow(UnprocessableEntityException);
    });
  });

  describe('sendSms', () => {
    const smsDto: SmsRequestDto = {
      msisdn: '1234567890',
      msg: 'Test Message',
    };

    it('should send SMS successfully', async () => {
      const mockResponse = { success: true };
      mockTrustFundService.sendSms.mockResolvedValue(mockResponse);

      const result = await service.sendSms(smsDto);

      expect(result).toEqual(mockResponse);
      expect(mockTrustFundService.sendSms).toHaveBeenCalledWith(smsDto);
    });

    it('should throw UnprocessableEntityException when SMS sending fails', async () => {
      const error = new Error('Failed to send SMS');
      mockTrustFundService.sendSms.mockRejectedValue(error);

      await expect(service.sendSms(smsDto)).rejects.toThrow(UnprocessableEntityException);
    });
  });

  describe('customerOnboarding', () => {
    const onboardingDto: CustomerOnboardingRequestDto = {
      formRefno: 'REF123',
      schemeId: 'SCH123',
      ssn: 'SSN123',
      gender: 'M',
      title: 'Mr',
      firstname: 'John',
      surname: 'Doe',
      maritalStatusCode: 'S',
      placeOfBirth: 'Lagos',
      mobilePhone: '1234567890',
      permanentAddressLocation: 'Lagos',
      nationalityCode: 'NGA',
      stateOfOrigin: 'Lagos',
      lgaCode: 'LGA123',
      permCountry: 'Nigeria',
      permState: 'Lagos',
      permLga: 'LGA123',
      permCity: 'Lagos',
      bankName: 'Test Bank',
      accountNumber: '1234567890',
      accountName: 'John Doe',
      bvn: '12345678901',
      othernames: '',
      maidenName: '',
      email: 'john@example.com',
      permanentAddress: '123 Test Street',
      permBox: '',
      permanentAddress1: '',
      permZip: '',
      employerType: 'Private',
      employerRcno: 'RC123',
      dateOfFirstApointment: '2023-01-01',
      employerLocation: 'Lagos',
      employerCountry: 'Nigeria',
      employerStatecode: 'LAG',
      employerLga: 'LGA123',
      employerCity: 'Lagos',
      employerBusiness: 'Technology',
      employerAddress1: '123 Business Street',
      employerAddress: '123 Business Street',
      employerZip: '',
      employerBox: '',
      employerPhone: '1234567890',
      nokTitle: 'Mrs',
      nokName: 'Jane',
      nokSurname: 'Doe',
      nokGender: 'F',
      nokRelationship: 'Spouse',
      nokLocation: 'Lagos',
      nokCountry: 'Nigeria',
      nokStatecode: 'LAG',
      nokLga: 'LGA123',
      nokCity: 'Lagos',
      nokOthername: '',
      nokAddress1: '123 NOK Street',
      nokAddress: '123 NOK Street',
      nokZip: '',
      nokEmailaddress: '',
      nokBox: '',
      nokMobilePhone: '1234567890',
      pictureImage: '',
      formImage: '',
      signatureImage: '',
      stateOfPosting: 'Lagos',
      agentCode: 'AGT123',
      dateOfBirth: '1990-01-01',
    };

    it('should onboard customer successfully', async () => {
      const mockResponse = { pin: 'PIN123' };
      mockTrustFundService.customerOnboarding.mockResolvedValue(mockResponse);

      const result = await service.customerOnboarding(onboardingDto);

      expect(result).toEqual({
        status: true,
        message: 'Customer onboarding completed successfully',
        data: mockResponse,
      });
      expect(mockTrustFundService.customerOnboarding).toHaveBeenCalledWith(onboardingDto);
    });

    it('should return error response when onboarding fails', async () => {
      const error = new Error('Failed to onboard customer');
      mockTrustFundService.customerOnboarding.mockRejectedValue(error);

      const result = await service.customerOnboarding(onboardingDto);

      expect(result).toEqual({
        status: false,
        message: 'Failed to complete onboarding',
        data: {},
      });
    });
  });

  describe('getLastTenContributions', () => {
    const userId = '123';
    const mockUser = {
      id: userId,
      rsa_pin: 'PIN123',
    };

    it('should get last ten contributions successfully', async () => {
      mockUserService.findOne.mockResolvedValue(mockUser);
      const mockResponse = { contributions: [] };
      mockTrustFundService.getLastTenContributions.mockResolvedValue(mockResponse);

      const result = await service.getLastTenContributions(userId);

      expect(result).toEqual(mockResponse);
      expect(mockTrustFundService.getLastTenContributions).toHaveBeenCalledWith({ pin: mockUser.rsa_pin });
    });

    it('should throw UnprocessableEntityException when user not found', async () => {
      mockUserService.findOne.mockResolvedValue(null);

      await expect(service.getLastTenContributions(userId)).rejects.toThrow(UnprocessableEntityException);
    });
  });

  describe('getAccountManager', () => {
    const userId = '123';
    const mockUser = {
      id: userId,
      rsa_pin: 'PIN123',
    };

    it('should get account manager successfully', async () => {
      mockUserService.findOne.mockResolvedValue(mockUser);
      const mockResponse = { manager: {} };
      mockTrustFundService.getAccountManager.mockResolvedValue(mockResponse);

      const result = await service.getAccountManager(userId);

      expect(result).toEqual(mockResponse);
      expect(mockTrustFundService.getAccountManager).toHaveBeenCalledWith({ rsa_number: mockUser.rsa_pin });
    });

    it('should throw UnprocessableEntityException when user not found', async () => {
      mockUserService.findOne.mockResolvedValue(null);

      await expect(service.getAccountManager(userId)).rejects.toThrow(UnprocessableEntityException);
    });
  });

  describe('getSummary', () => {
    const userId = '123';
    const mockUser = {
      id: userId,
      rsa_pin: 'PIN123',
    };

    it('should get summary successfully', async () => {
      mockUserService.findOne.mockResolvedValue(mockUser);
      const mockResponse = { summary: {} };
      mockTrustFundService.getSummary.mockResolvedValue(mockResponse);

      const result = await service.getSummary(userId);

      expect(result).toEqual(mockResponse);
      expect(mockTrustFundService.getSummary).toHaveBeenCalledWith({ pin: mockUser.rsa_pin });
    });

    it('should throw UnprocessableEntityException when user not found', async () => {
      mockUserService.findOne.mockResolvedValue(null);

      await expect(service.getSummary(userId)).rejects.toThrow(UnprocessableEntityException);
    });
  });

  describe('validateRsaPin', () => {
    const rsaPin = '12345678901';
    const mockSummaryResponse = {
      status: true,
      message: 'Summary retrieved successfully',
      data: {
        name: 'John Doe',
        pin: rsaPin,
        // Add other summary data as needed
      }
    };

    it('should validate RSA PIN successfully', async () => {
      mockTrustFundService.getSummary.mockResolvedValue(mockSummaryResponse);

      const result = await service.validateRsaPin(rsaPin);

      expect(result).toEqual(mockSummaryResponse);
      expect(mockTrustFundService.getSummary).toHaveBeenCalledWith({ pin: rsaPin });
    });

    it('should throw UnprocessableEntityException when validation fails', async () => {
      const error = new Error('API Error');
      mockTrustFundService.getSummary.mockRejectedValue(error);

      await expect(service.validateRsaPin(rsaPin)).rejects.toThrow(UnprocessableEntityException);
      expect(mockTrustFundService.getSummary).toHaveBeenCalledWith({ pin: rsaPin });
    });
  });
}); 