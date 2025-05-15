import { Test, TestingModule } from '@nestjs/testing';
import { PensionController } from './pension.controller';
import { PensionService } from '../services/pension.service';
import { Response } from 'express';
import {
  EmailRequestDto,
  SmsRequestDto,
  ContributionRequestDto,
  AccountManagerRequestDto,
  SummaryRequestDto,
  CustomerOnboardingRequestDto,
  GenerateReportQueryDto,
} from '../dto';
import { IDecodedJwtToken } from '../../../modules/auth/strategies/types';
import { USER_ROLE } from '../../../core/constants';
import { JwtAuthGuard } from '../../../core/auth/guards/jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';
import { UnprocessableEntityException } from '@nestjs/common';

describe('PensionController', () => {
  let controller: PensionController;
  let service: PensionService;

  const mockToken: IDecodedJwtToken = {
    id: '123',
    userRoles: [
      {
        id: '1',
        userId: '123',
        roleId: USER_ROLE.CLIENT
      }
    ]
  };

  const mockPensionService = {
    sendEmail: jest.fn(),
    sendSms: jest.fn(),
    getFundTypes: jest.fn(),
    getLastTenContributions: jest.fn(),
    getAccountManager: jest.fn(),
    getSummary: jest.fn(),
    customerOnboarding: jest.fn(),
    generateReport: jest.fn(),
    generateWelcomeLetter: jest.fn(),
    validateRsaPin: jest.fn(),
  };

  const mockJwtService = {
    verifyAsync: jest.fn().mockResolvedValue(mockToken),
  };

  const mockJwtAuthGuard = {
    canActivate: jest.fn().mockImplementation(() => true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PensionController],
      providers: [
        {
          provide: PensionService,
          useValue: mockPensionService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: JwtAuthGuard,
          useValue: mockJwtAuthGuard,
        },
      ],
    }).compile();

    controller = module.get<PensionController>(PensionController);
    service = module.get<PensionService>(PensionService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('sendEmail', () => {
    it('should send email successfully', async () => {
      const emailDto: EmailRequestDto = {
        to: 'test@example.com',
        subject: 'Test Subject',
        body: 'Test Body'
      };

      const expectedResponse = {
        status: true,
        message: 'Email sent successfully',
        data: {},
      };

      mockPensionService.sendEmail.mockResolvedValue(expectedResponse);

      const result = await controller.sendEmail(emailDto);
      expect(result).toEqual(expectedResponse);
      expect(service.sendEmail).toHaveBeenCalledWith(emailDto);
    });
  });

  describe('sendSms', () => {
    it('should send SMS successfully', async () => {
      const smsDto: SmsRequestDto = {
        msisdn: '1234567890',
        msg: 'Test Message'
      };

      const expectedResponse = {
        status: true,
        message: 'SMS sent successfully',
        data: {},
      };

      mockPensionService.sendSms.mockResolvedValue(expectedResponse);

      const result = await controller.sendSms(smsDto);
      expect(result).toEqual(expectedResponse);
      expect(service.sendSms).toHaveBeenCalledWith(smsDto);
    });
  });

  describe('getFundTypes', () => {
    it('should get fund types successfully', async () => {
      const expectedResponse = {
        status: true,
        message: 'Fund types retrieved successfully',
        data: { fundTypes: [] },
      };

      mockPensionService.getFundTypes.mockResolvedValue(expectedResponse);

      const result = await controller.getFundTypes();
      expect(result).toEqual(expectedResponse);
      expect(service.getFundTypes).toHaveBeenCalled();
    });
  });

  describe('getLastTenContributions', () => {
    it('should get last ten contributions successfully', async () => {
      const expectedResponse = {
        status: true,
        message: 'Contributions retrieved successfully',
        data: { contributions: [] },
      };

      mockPensionService.getLastTenContributions.mockResolvedValue(expectedResponse);

      const result = await controller.getLastTenContributions(mockToken);
      expect(result).toEqual(expectedResponse);
      expect(service.getLastTenContributions).toHaveBeenCalledWith(mockToken.id);
    });
  });

  describe('getAccountManager', () => {
    it('should get account manager details successfully', async () => {
      const expectedResponse = {
        status: true,
        message: 'Account manager details retrieved successfully',
        data: { manager: {} },
      };

      mockPensionService.getAccountManager.mockResolvedValue(expectedResponse);

      const result = await controller.getAccountManager(mockToken);
      expect(result).toEqual(expectedResponse);
      expect(service.getAccountManager).toHaveBeenCalledWith(mockToken.id);
    });
  });

  describe('getSummary', () => {
    it('should get summary successfully', async () => {
      const expectedResponse = {
        status: true,
        message: 'Summary retrieved successfully',
        data: {},
      };

      mockPensionService.getSummary.mockResolvedValue(expectedResponse);

      const result = await controller.getSummary(mockToken);
      expect(result).toEqual(expectedResponse);
      expect(service.getSummary).toHaveBeenCalledWith(mockToken.id);
    });
  });

  describe('customerOnboarding', () => {
    it('should onboard customer successfully', async () => {
      const onboardingDto: CustomerOnboardingRequestDto = {
        formRefno: 'REF123',
        schemeId: 'SCH123',
        ssn: 'SSN123',
        gender: 'M',
        title: 'Mr',
        firstname: 'John',
        surname: 'Doe',
        othernames: '',
        maidenName: '',
        maritalStatusCode: 'S',
        placeOfBirth: 'Lagos',
        mobilePhone: '1234567890',
        permanentAddressLocation: 'Lagos',
        permBox: '',
        permanentAddress1: '',
        permZip: '',
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
        email: 'john@example.com',
        permanentAddress: '123 Test Street',
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
        dateOfBirth: '1990-01-01'
      };

      const expectedResponse = {
        status: true,
        message: 'Customer onboarding completed successfully',
        data: {},
      };

      mockPensionService.customerOnboarding.mockResolvedValue(expectedResponse);

      const result = await controller.customerOnboarding(onboardingDto);
      expect(result).toEqual(expectedResponse);
      expect(service.customerOnboarding).toHaveBeenCalledWith(onboardingDto);
    });
  });

  describe('generateReport', () => {
    it('should generate report successfully', async () => {
      const query: GenerateReportQueryDto = {
        fromDate: '2023-01-01',
        toDate: '2023-12-31',
      };

      const mockResponse = {
        set: jest.fn(),
        end: jest.fn(),
      } as unknown as Response;

      const mockBuffer = Buffer.from('test');
      mockPensionService.generateReport.mockResolvedValue(mockBuffer);

      await controller.generateReport(query, mockToken, mockResponse);

      expect(service.generateReport).toHaveBeenCalledWith(query, mockToken.id);
      expect(mockResponse.set).toHaveBeenCalledWith({
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=pension-report.pdf',
        'Content-Length': mockBuffer.length,
      });
      expect(mockResponse.end).toHaveBeenCalledWith(mockBuffer);
    });
  });

  describe('generateWelcomeLetter', () => {
    it('should generate welcome letter successfully', async () => {
      const mockBuffer = Buffer.from('test');
      mockPensionService.generateWelcomeLetter.mockResolvedValue(mockBuffer);

      const mockResponse = {
        set: jest.fn(),
        end: jest.fn(),
      } as unknown as Response;

      await controller.generateWelcomeLetter(mockToken, mockResponse);

      expect(service.generateWelcomeLetter).toHaveBeenCalledWith(mockToken.id);
      expect(mockResponse.set).toHaveBeenCalledWith({
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=welcome-letter.pdf',
        'Content-Length': mockBuffer.length,
      });
      expect(mockResponse.end).toHaveBeenCalledWith(mockBuffer);
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
      mockPensionService.validateRsaPin.mockResolvedValue(mockSummaryResponse);

      const result = await controller.validateRsaPin(rsaPin);

      expect(result).toEqual(mockSummaryResponse);
      expect(mockPensionService.validateRsaPin).toHaveBeenCalledWith(rsaPin);
    });

    it('should handle validation failure', async () => {
      const error = new UnprocessableEntityException('Failed to get summary');
      mockPensionService.validateRsaPin.mockRejectedValue(error);

      await expect(controller.validateRsaPin(rsaPin)).rejects.toThrow(UnprocessableEntityException);
      expect(mockPensionService.validateRsaPin).toHaveBeenCalledWith(rsaPin);
    });
  });
}); 