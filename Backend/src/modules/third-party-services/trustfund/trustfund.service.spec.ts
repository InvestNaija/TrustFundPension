import { Test, TestingModule } from '@nestjs/testing';
import { TrustFundService } from './trustfund.service';
import { HttpRequestService } from '../../../shared/http-request';
import { UnprocessableEntityException } from '@nestjs/common';
import { envConfig } from '../../../core/config';
import {
  IEmailRequest,
  IEmailResponse,
  ISmsRequest,
  ISmsResponse,
  IFundType,
  IContribution,
  IContributionRequest,
  IAccountManagerRequest,
  IAccountManager,
  ILoginResponse,
  ISummaryRequest,
  ISummaryResponse,
  ICustomerOnboardingRequest,
  IGenerateReportRequest,
  IWelcomeLetterRequest,
} from './types';

// Mock environment variables
jest.mock('../../../core/config', () => ({
  envConfig: {
    TRUSTFUND_EMAIL_FROM: 'test@trustfund.com',
    TRUSTFUND_EMAIL_FROM_NAME: 'TrustFund Test',
    TRUSTFUND_SMS_USERNAME: 'test-sms-user',
    TRUSTFUND_SMS_PASSWORD: 'test-sms-pass',
    TRUSTFUND_SMS_SENDER: 'TrustFund',
    TRUSTFUND_USERNAME: 'test-user',
    TRUSTFUND_PASSWORD: 'test-pass',
    TRUSTFUND_BASE_URL: 'https://api.trustfund.com',
    TRUSTFUND_URL: 'https://api.trustfund.com',
  },
}));

describe('TrustFundService', () => {
  let service: TrustFundService;
  let httpRequestService: HttpRequestService;

  const mockHttpRequestService = {
    makeRequest: jest.fn(),
  };

  const mockLoginResponse: ILoginResponse = {
    access_token: 'test-token',
    token_type: 'Bearer',
    expires_in: 3600
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TrustFundService,
        {
          provide: HttpRequestService,
          useValue: mockHttpRequestService,
        },
      ],
    }).compile();

    service = module.get<TrustFundService>(TrustFundService);
    httpRequestService = module.get<HttpRequestService>(HttpRequestService);

    // Reset all mocks
    jest.clearAllMocks();
    
    // Mock successful login by default
    mockHttpRequestService.makeRequest.mockImplementation(async (config) => {
      if (config.url?.includes('/auth/login')) {
        return mockLoginResponse;
      }
      throw new Error('Unmocked request');
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('sendEmail', () => {
    const emailData: IEmailRequest = {
      to: 'test@example.com',
      subject: 'Test Subject',
      body: '<h1>Test Body</h1>',
    };

    const successResponse: IEmailResponse = {
      status: 'success',
      message: 'Email sent successfully.',
    };

    it('should send email successfully', async () => {
      mockHttpRequestService.makeRequest.mockResolvedValueOnce(successResponse);

      const result = await service.sendEmail(emailData);

      expect(result).toEqual(successResponse);
      expect(mockHttpRequestService.makeRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          data: {
            ...emailData,
            from: envConfig.TRUSTFUND_EMAIL_FROM,
            from_name: envConfig.TRUSTFUND_EMAIL_FROM_NAME,
          },
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        }),
      );
    });

    it('should throw UnprocessableEntityException on error', async () => {
      mockHttpRequestService.makeRequest.mockRejectedValueOnce(new Error());

      await expect(service.sendEmail(emailData)).rejects.toThrow(
        UnprocessableEntityException,
      );
    });
  });

  describe('sendSms', () => {
    const smsData: ISmsRequest = {
      msisdn: '+1234567890',
      msg: 'Test message',
    };

    const successResponse: ISmsResponse = {
      status: 'success',
      response: {
        results: [
          {
            msisdn: '+1234567890',
            smscount: '1',
            code: '0',
            reason: 'ACCEPTED',
            ticket: 'test-ticket',
          },
        ],
      },
    };

    it('should send SMS successfully', async () => {
      mockHttpRequestService.makeRequest.mockResolvedValueOnce(successResponse);

      const result = await service.sendSms(smsData);

      expect(result).toEqual(successResponse);
      expect(mockHttpRequestService.makeRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          data: {
            ...smsData,
            username: envConfig.TRUSTFUND_SMS_USERNAME,
            password: envConfig.TRUSTFUND_SMS_PASSWORD,
            sender: envConfig.TRUSTFUND_SMS_SENDER,
          },
        }),
      );
    });

    it('should throw UnprocessableEntityException on error', async () => {
      mockHttpRequestService.makeRequest.mockRejectedValueOnce(new Error());

      await expect(service.sendSms(smsData)).rejects.toThrow(
        UnprocessableEntityException,
      );
    });
  });

  describe('getFundTypes', () => {
    const successResponse: IFundType[] = [
      {
        scheme_ID: '1',
        scheme_name: 'TRUSTFUND RSA FUND 2',
      },
    ];

    it('should get fund types successfully', async () => {
      mockHttpRequestService.makeRequest.mockResolvedValueOnce(successResponse);

      const result = await service.getFundTypes();

      expect(result).toEqual(successResponse);
      expect(mockHttpRequestService.makeRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
        }),
      );
    });

    it('should throw UnprocessableEntityException on error', async () => {
      mockHttpRequestService.makeRequest.mockRejectedValueOnce(new Error());

      await expect(service.getFundTypes()).rejects.toThrow(
        UnprocessableEntityException,
      );
    });
  });

  describe('getLastTenContributions', () => {
    const contributionRequest: IContributionRequest = {
      pin: 'PEN100048037525',
    };

    const successResponse: IContribution[] = [
      {
        Date: 'Feb-2021',
        EMPLOYEE_CONTRIBUTION: '184.09',
        EMPLOYER_CONTRIBUTION: '.00',
        OTHER_CONTRIBUTION: '.00',
      },
    ];

    it('should get contributions successfully', async () => {
      mockHttpRequestService.makeRequest.mockResolvedValueOnce(successResponse);

      const result = await service.getLastTenContributions(contributionRequest);

      expect(result).toEqual(successResponse);
      expect(mockHttpRequestService.makeRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          data: contributionRequest,
        }),
      );
    });

    it('should throw UnprocessableEntityException on error', async () => {
      mockHttpRequestService.makeRequest.mockRejectedValueOnce(new Error());

      await expect(
        service.getLastTenContributions(contributionRequest),
      ).rejects.toThrow(UnprocessableEntityException);
    });
  });

  describe('getAccountManager', () => {
    const managerRequest: IAccountManagerRequest = {
      rsa_number: 'PEN100048037525',
    };

    const successResponse: IAccountManager[] = [
      {
        AGENT_NAME: 'Test Agent',
        AGENT_PHONE: null,
      },
    ];

    it('should get account manager successfully', async () => {
      mockHttpRequestService.makeRequest.mockResolvedValueOnce(successResponse);

      const result = await service.getAccountManager(managerRequest);

      expect(result).toEqual(successResponse);
      expect(mockHttpRequestService.makeRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          data: managerRequest,
        }),
      );
    });

    it('should throw UnprocessableEntityException on error', async () => {
      mockHttpRequestService.makeRequest.mockRejectedValueOnce(new Error());

      await expect(service.getAccountManager(managerRequest)).rejects.toThrow(
        UnprocessableEntityException,
      );
    });
  });

  describe('login', () => {
    it('should login successfully', async () => {
      await service.login();

      expect(mockHttpRequestService.makeRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: expect.stringContaining('/auth/login'),
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          Authorization: expect.stringContaining('Basic '),
        }),
      });
    });

    it('should throw UnprocessableEntityException on error', async () => {
      mockHttpRequestService.makeRequest.mockRejectedValueOnce(new Error());

      await expect(service.login()).rejects.toThrow(
        UnprocessableEntityException,
      );
    });
  });

  describe('getSummary', () => {
    const summaryRequest: ISummaryRequest = {
      pin: 'PEN100048037525'
    };

    it('should get summary successfully', async () => {
      const successResponse = { status: true, data: { /* summary data */ } };

      mockHttpRequestService.makeRequest
        .mockResolvedValueOnce({ data: { token: 'test-token' } }) // Login response
        .mockResolvedValueOnce({ data: successResponse }); // Get summary response

      const result = await service.getSummary(summaryRequest);

      expect(result).toEqual(successResponse);
      expect(mockHttpRequestService.makeRequest).toHaveBeenNthCalledWith(2, {
        method: 'POST',
        url: expect.stringContaining('/getsummary'),
        data: summaryRequest,
      });
    });

    it('should throw UnprocessableEntityException on error', async () => {
      mockHttpRequestService.makeRequest.mockRejectedValueOnce(new Error());
      await expect(service.getSummary(summaryRequest)).rejects.toThrow(UnprocessableEntityException);
    });
  });

  describe('customerOnboarding', () => {
    const onboardingRequest: ICustomerOnboardingRequest = {
      formRefno: '1yu',
      schemeId: '12',
      ssn: '1345765856192',
      gender: 'm',
      title: 'Mr',
      firstname: 'HUNDU',
      surname: 'valentine',
      maritalStatusCode: 'MD',
      placeOfBirth: 'ABUJA',
      mobilePhone: '091976543678',
      permanentAddressLocation: 'N',
      nationalityCode: 'NG',
      stateOfOrigin: 'BE',
      lgaCode: 'TKP',
      permCountry: 'NG',
      permState: 'BE',
      permLga: 'TKP',
      permCity: 'ABUJA',
      bankName: 'ACCESS',
      accountNumber: '1234567899',
      accountName: 'EDWARDEDDY',
      bvn: '',
      othernames: 'VER',
      maidenName: '',
      email: 'test@example.com',
      permanentAddress: 'MAITAMA',
      permBox: '234',
      permanentAddress1: '',
      permZip: '',
      employerType: 'PU',
      employerRcno: '1234567',
      dateOfFirstApointment: '1982-03-14',
      employerLocation: 'N',
      employerCountry: 'NG',
      employerStatecode: 'BE',
      employerLga: 'LGA',
      employerCity: 'ABUJA',
      employerBusiness: 'PENSION',
      employerAddress1: 'PLOT 6816',
      employerAddress: 'LABOURHOUSE',
      employerZip: '+234',
      employerBox: '+234',
      employerPhone: '0987654321',
      nokTitle: 'MR',
      nokName: 'HUNDU',
      nokSurname: 'VALENTINE',
      nokGender: 'M',
      nokRelationship: 'BROTHER',
      nokLocation: 'N',
      nokCountry: 'NG',
      nokStatecode: 'BE',
      nokLga: 'TKP',
      nokCity: 'ABUJA',
      nokOthername: 'VAL',
      nokAddress1: 'ASOKORO',
      nokAddress: 'ASOKOROSTR',
      nokZip: '+234',
      nokEmailaddress: 'test@example.com',
      nokBox: '',
      nokMobilePhone: '08062642426',
      pictureImage: 'base64-image-data',
      formImage: 'base64-image-data',
      signatureImage: 'base64-image-data',
      stateOfPosting: 'BN',
      agentCode: '1234567',
      dateOfBirth: '1982-03-14',
    };

    it('should complete customer onboarding successfully', async () => {
      mockHttpRequestService.makeRequest.mockResolvedValueOnce({ access_token: 'test-token' });
      mockHttpRequestService.makeRequest.mockResolvedValueOnce({});

      await service.customerOnboarding(onboardingRequest);

      expect(mockHttpRequestService.makeRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          data: onboardingRequest,
        }),
      );
    });

    it('should throw UnprocessableEntityException on error', async () => {
      mockHttpRequestService.makeRequest.mockRejectedValueOnce(new Error());

      await expect(service.customerOnboarding(onboardingRequest)).rejects.toThrow(
        UnprocessableEntityException,
      );
    });
  });

  describe('generateReport', () => {
    const reportRequest: IGenerateReportRequest = {
      pin: 'PEN100048037525',
      fromDate: '2022-02-01',
      toDate: '2024-04-31'
    };

    it('should generate report successfully', async () => {
      const pdfBuffer = Buffer.from('test-pdf-content');

      mockHttpRequestService.makeRequest
        .mockResolvedValueOnce({ data: { token: 'test-token' } }) // Login response
        .mockResolvedValueOnce({ data: pdfBuffer }); // Generate report response

      const result = await service.generateReport(reportRequest);

      expect(result).toEqual({ data: pdfBuffer });
      expect(mockHttpRequestService.makeRequest).toHaveBeenNthCalledWith(2, {
        method: 'POST',
        url: expect.stringContaining('/generate/report-pin'),
        data: reportRequest,
      });
    });

    it('should throw UnprocessableEntityException on error', async () => {
      mockHttpRequestService.makeRequest.mockRejectedValueOnce(new Error());
      await expect(service.generateReport(reportRequest)).rejects.toThrow(UnprocessableEntityException);
    });
  });

  describe('generateWelcomeLetter', () => {
    const letterRequest: IWelcomeLetterRequest = {
      pin: 'PEN210063424591'
    };

    it('should generate welcome letter successfully', async () => {
      const pdfBuffer = Buffer.from('test-pdf-content');

      mockHttpRequestService.makeRequest
        .mockResolvedValueOnce({ data: { token: 'test-token' } }) // Login response
        .mockResolvedValueOnce({ data: pdfBuffer }); // Generate welcome letter response

      const result = await service.generateWelcomeLetter(letterRequest);

      expect(result).toEqual({ data: pdfBuffer });
      expect(mockHttpRequestService.makeRequest).toHaveBeenNthCalledWith(2, {
        method: 'POST',
        url: expect.stringContaining('/generate/welcome-letter'),
        data: letterRequest,
      });
    });

    it('should throw UnprocessableEntityException on error', async () => {
      mockHttpRequestService.makeRequest.mockRejectedValueOnce(new Error());
      await expect(service.generateWelcomeLetter(letterRequest)).rejects.toThrow(UnprocessableEntityException);
    });
  });
});
