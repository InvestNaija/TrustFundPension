import { Test, TestingModule } from '@nestjs/testing';
import { PensionService } from './pension.service';
import { TrustFundService } from '../../third-party-services/trustfund/trustfund.service';
import {
  EmailRequestDto,
  SmsRequestDto,
  ContributionRequestDto,
  AccountManagerRequestDto,
  SummaryRequestDto,
  CustomerOnboardingRequestDto,
  GenerateReportQueryDto,
} from '../dto';

describe('PensionService', () => {
  let service: PensionService;
  let trustFundService: TrustFundService;

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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PensionService,
        {
          provide: TrustFundService,
          useValue: mockTrustFundService,
        },
      ],
    }).compile();

    service = module.get<PensionService>(PensionService);
    trustFundService = module.get<TrustFundService>(TrustFundService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendEmail', () => {
    const emailDto: EmailRequestDto = {
      to: 'test@example.com',
      subject: 'Test Subject',
      body: 'Test Body',
      from: 'from@example.com',
      from_name: 'Test Sender',
    };

    it('should send email successfully', async () => {
      mockTrustFundService.sendEmail.mockResolvedValue({ success: true });

      const result = await service.sendEmail(emailDto);

      expect(result).toEqual({
        status: true,
        message: 'Email sent successfully',
        data: { success: true },
      });
      expect(trustFundService.sendEmail).toHaveBeenCalledWith({
        to: emailDto.to,
        subject: emailDto.subject,
        body: emailDto.body,
        from: emailDto.from,
        from_name: emailDto.from_name,
      });
    });

    it('should handle email sending error', async () => {
      const error = new Error('Failed to send');
      mockTrustFundService.sendEmail.mockRejectedValue(error);

      const result = await service.sendEmail(emailDto);

      expect(result).toEqual({
        status: false,
        message: 'Failed to send',
        data: {},
      });
    });
  });

  describe('sendSms', () => {
    const smsDto: SmsRequestDto = {
      username: 'testuser',
      password: 'testpass',
      msisdn: '1234567890',
      msg: 'Test Message',
      sender: 'TestSender',
    };

    it('should send SMS successfully', async () => {
      mockTrustFundService.sendSms.mockResolvedValue({ success: true });

      const result = await service.sendSms(smsDto);

      expect(result).toEqual({
        status: true,
        message: 'SMS sent successfully',
        data: { success: true },
      });
      expect(trustFundService.sendSms).toHaveBeenCalledWith(smsDto);
    });

    it('should handle SMS sending error', async () => {
      const error = new Error('Failed to send SMS');
      mockTrustFundService.sendSms.mockRejectedValue(error);

      const result = await service.sendSms(smsDto);

      expect(result).toEqual({
        status: false,
        message: 'Failed to send SMS',
        data: {},
      });
    });
  });

  describe('getFundTypes', () => {
    it('should get fund types successfully', async () => {
      const mockFundTypes = [{ id: 1, name: 'Fund I' }];
      mockTrustFundService.getFundTypes.mockResolvedValue(mockFundTypes);

      const result = await service.getFundTypes();

      expect(result).toEqual({
        status: true,
        message: 'Fund types retrieved successfully',
        data: { fundTypes: mockFundTypes },
      });
      expect(trustFundService.getFundTypes).toHaveBeenCalled();
    });

    it('should handle get fund types error', async () => {
      const error = new Error('Failed to get fund types');
      mockTrustFundService.getFundTypes.mockRejectedValue(error);

      const result = await service.getFundTypes();

      expect(result).toEqual({
        status: false,
        message: 'Failed to get fund types',
        data: {},
      });
    });
  });

  describe('getLastTenContributions', () => {
    const contributionDto: ContributionRequestDto = { pin: '12345' };

    it('should get contributions successfully', async () => {
      const mockContributions = [{ amount: 1000, date: '2023-01-01' }];
      mockTrustFundService.getLastTenContributions.mockResolvedValue(mockContributions);

      const result = await service.getLastTenContributions(contributionDto);

      expect(result).toEqual({
        status: true,
        message: 'Contributions retrieved successfully',
        data: { contributions: mockContributions },
      });
      expect(trustFundService.getLastTenContributions).toHaveBeenCalledWith({ pin: contributionDto.pin });
    });

    it('should handle get contributions error', async () => {
      const error = new Error('Failed to get contributions');
      mockTrustFundService.getLastTenContributions.mockRejectedValue(error);

      const result = await service.getLastTenContributions(contributionDto);

      expect(result).toEqual({
        status: false,
        message: 'Failed to get contributions',
        data: {},
      });
    });
  });

  describe('getAccountManager', () => {
    const managerDto: AccountManagerRequestDto = { rsa_number: '12345' };

    it('should get account manager successfully', async () => {
      const mockManager = { name: 'John Doe', email: 'john@example.com' };
      mockTrustFundService.getAccountManager.mockResolvedValue(mockManager);

      const result = await service.getAccountManager(managerDto);

      expect(result).toEqual({
        status: true,
        message: 'Account manager details retrieved successfully',
        data: { manager: mockManager },
      });
      expect(trustFundService.getAccountManager).toHaveBeenCalledWith({ rsa_number: managerDto.rsa_number });
    });

    it('should handle get account manager error', async () => {
      const error = new Error('Failed to get account manager');
      mockTrustFundService.getAccountManager.mockRejectedValue(error);

      const result = await service.getAccountManager(managerDto);

      expect(result).toEqual({
        status: false,
        message: 'Failed to get account manager',
        data: {},
      });
    });
  });

  describe('getSummary', () => {
    const summaryDto: SummaryRequestDto = { pin: '12345' };

    it('should get summary successfully', async () => {
      const mockSummary = { balance: 10000, contributions: 5000 };
      mockTrustFundService.getSummary.mockResolvedValue(mockSummary);

      const result = await service.getSummary(summaryDto);

      expect(result).toEqual({
        status: true,
        message: 'Summary retrieved successfully',
        data: mockSummary,
      });
      expect(trustFundService.getSummary).toHaveBeenCalledWith({ pin: summaryDto.pin });
    });

    it('should handle get summary error', async () => {
      const error = new Error('Failed to get summary');
      mockTrustFundService.getSummary.mockRejectedValue(error);

      const result = await service.getSummary(summaryDto);

      expect(result).toEqual({
        status: false,
        message: 'Failed to get summary',
        data: {},
      });
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
      nokAddress1: '123 NOK Street',
      nokAddress: '123 NOK Street',
      nokMobilePhone: '1234567890',
      stateOfPosting: 'Lagos',
      agentCode: 'AGT123',
      dateOfBirth: '1990-01-01',
    };

    it('should complete customer onboarding successfully', async () => {
      const mockResponse = { customerId: 'CUST123' };
      mockTrustFundService.customerOnboarding.mockResolvedValue(mockResponse);

      const result = await service.customerOnboarding(onboardingDto);

      expect(result).toEqual({
        status: true,
        message: 'Customer onboarding completed successfully',
        data: mockResponse,
      });
      expect(trustFundService.customerOnboarding).toHaveBeenCalledWith(expect.objectContaining({
        ...onboardingDto,
        othernames: '',
        maidenName: '',
        permBox: '',
        permanentAddress1: '',
        permZip: '',
        employerZip: '',
        employerBox: '',
        nokOthername: '',
        nokZip: '',
        nokEmailaddress: '',
        nokBox: '',
        pictureImage: '',
        formImage: '',
        signatureImage: '',
      }));
    });

    it('should handle customer onboarding error', async () => {
      const error = new Error('Failed to complete onboarding');
      mockTrustFundService.customerOnboarding.mockRejectedValue(error);

      const result = await service.customerOnboarding(onboardingDto);

      expect(result).toEqual({
        status: false,
        message: 'Failed to complete onboarding',
        data: {},
      });
    });
  });

  describe('generateReport', () => {
    const reportQuery: GenerateReportQueryDto = {
      pin: '12345',
      fromDate: '2023-01-01',
      toDate: '2023-12-31',
    };

    it('should generate report successfully', async () => {
      const mockBuffer = Buffer.from('test report');
      mockTrustFundService.generateReport.mockResolvedValue(mockBuffer);

      const result = await service.generateReport(reportQuery);

      expect(result).toEqual(mockBuffer);
      expect(trustFundService.generateReport).toHaveBeenCalledWith(reportQuery);
    });

    it('should handle generate report error', async () => {
      const error = new Error('Failed to generate report');
      mockTrustFundService.generateReport.mockRejectedValue(error);

      await expect(service.generateReport(reportQuery)).rejects.toThrow(error);
    });
  });

  describe('generateWelcomeLetter', () => {
    const welcomeLetterData = { pin: '12345' };

    it('should generate welcome letter successfully', async () => {
      const mockBuffer = Buffer.from('test letter');
      mockTrustFundService.generateWelcomeLetter.mockResolvedValue(mockBuffer);

      const result = await service.generateWelcomeLetter(welcomeLetterData);

      expect(result).toEqual(mockBuffer);
      expect(trustFundService.generateWelcomeLetter).toHaveBeenCalledWith(welcomeLetterData);
    });

    it('should handle generate welcome letter error', async () => {
      const error = new Error('Failed to generate welcome letter');
      mockTrustFundService.generateWelcomeLetter.mockRejectedValue(error);

      await expect(service.generateWelcomeLetter(welcomeLetterData)).rejects.toThrow(error);
    });
  });
}); 