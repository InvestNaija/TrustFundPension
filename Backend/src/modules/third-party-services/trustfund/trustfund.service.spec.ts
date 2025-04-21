import { Test, TestingModule } from '@nestjs/testing';
import { TrustFundService } from './trustfund.service';
import { HttpRequestService } from '../../../shared/http-request';
import { UnprocessableEntityException } from '@nestjs/common';
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

describe('TrustFundService', () => {
  let service: TrustFundService;
  let httpRequestService: HttpRequestService;

  const mockHttpRequestService = {
    makeRequest: jest.fn(),
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
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('sendEmail', () => {
    const emailData: IEmailRequest = {
      to: 'test@example.com',
      subject: 'Test Subject',
      body: '<h1>Test Body</h1>',
      from: 'from@example.com',
      from_name: 'Test Sender',
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
          data: emailData,
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
      username: 'testuser',
      password: 'testpass',
      msisdn: '+1234567890',
      msg: 'Test message',
      sender: 'TestSender',
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
          data: smsData,
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
    const successResponse: ILoginResponse = {
      access_token: 'test-token',
    };

    it('should login successfully', async () => {
      mockHttpRequestService.makeRequest.mockResolvedValueOnce(successResponse);

      await service.login();

      expect(mockHttpRequestService.makeRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            Authorization: expect.any(String),
          }),
        }),
      );
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
      pin: 'PEN100048037525',
    };

    const successResponse: ISummaryResponse = {
      totalContributionMandatory: 324039.38,
      totalFeesMandatory: 4800,
      totalUnitMandatory: 51395.37,
      netContributionMandatory: -594478.24,
      totalContributionVoluntary: 0,
      totalFeesVoluntary: 0,
      totalUnitVoluntary: 0,
      netContributionVoluntary: 0,
      totalWithdrawalMandatory: 0,
      totalWithdrawalVoluntary: -913717.62,
      totalWithdrwal: -913717.62,
      totalBalance: 324039.38,
      balanceBF: null,
      balanceCL: null,
      unitPrice: 5.7533,
      balanceMandatory: 295692.982221,
      growthMandatory: 890171.222221,
      balanceVoluntary: 0,
      growthVoluntary: 0,
      schemeName: 'TRUSTFUND RSA FUND 4',
      fundId: 7,
      bioData: {
        pin: 'PEN100048037525',
        firstname: 'IBRAHIM',
        surname: 'SULEIMAN',
        othernames: '',
        email: 'test@example.com',
        mobilePhone: '08030696825',
        title: 'Mr',
        gender: 'M',
        dateOfBirth: 98838000000,
        permanentAddress: 'TEST ADDRESS',
        employerName: 'TEST EMPLOYER',
        nokMobilePhone: '1234567890',
        nokAddress: 'TEST NOK ADDRESS',
        nokSurname: 'TEST',
        nokOthername: 'NOK',
        nokRelationship: 'BROTHER',
        nokName: 'TEST NOK',
        nokEmailaddress: '',
        nok2Firstname: '',
        nok2Surname: '',
        nok2Othername: '',
        nok2Relationship: '',
        nok2Mobilephone: '',
        nok2Emailaddress: '',
        nok2Address: '',
        fundId: null,
        fundName: null,
      },
      contributions: null,
      priceList: null,
      price: 5.7533,
    };

    it('should get summary successfully', async () => {
      mockHttpRequestService.makeRequest.mockResolvedValueOnce({ access_token: 'test-token' });
      mockHttpRequestService.makeRequest.mockResolvedValueOnce(successResponse);

      const result = await service.getSummary(summaryRequest);

      expect(result).toEqual(successResponse);
      expect(mockHttpRequestService.makeRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          data: summaryRequest,
        }),
      );
    });

    it('should throw UnprocessableEntityException on error', async () => {
      mockHttpRequestService.makeRequest.mockRejectedValueOnce(new Error());

      await expect(service.getSummary(summaryRequest)).rejects.toThrow(
        UnprocessableEntityException,
      );
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
      toDate: '2024-04-31',
      fromDate: '2022-02-01',
    };

    it('should generate report successfully', async () => {
      const pdfBuffer = Buffer.from('fake-pdf-content');
      mockHttpRequestService.makeRequest.mockResolvedValueOnce({ access_token: 'test-token' });
      mockHttpRequestService.makeRequest.mockResolvedValueOnce(pdfBuffer);

      const result = await service.generateReport(reportRequest);

      expect(result).toEqual(pdfBuffer);
      expect(mockHttpRequestService.makeRequest).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          method: 'POST',
          url: expect.stringContaining('/generate/report-pin'),
          data: reportRequest,
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            Authorization: 'Bearer test-token',
            responseType: 'arraybuffer'
          })
        }),
      );
    });

    it('should throw UnprocessableEntityException on error', async () => {
      mockHttpRequestService.makeRequest.mockRejectedValueOnce(new Error());

      await expect(service.generateReport(reportRequest)).rejects.toThrow(
        UnprocessableEntityException,
      );
    });
  });

  describe('generateWelcomeLetter', () => {
    const letterRequest: IWelcomeLetterRequest = {
      pin: 'PEN210063424591',
    };

    it('should generate welcome letter successfully', async () => {
      const pdfBuffer = Buffer.from('fake-pdf-content');
      mockHttpRequestService.makeRequest.mockResolvedValueOnce({ access_token: 'test-token' });
      mockHttpRequestService.makeRequest.mockResolvedValueOnce(pdfBuffer);

      const result = await service.generateWelcomeLetter(letterRequest);

      expect(result).toEqual(pdfBuffer);
      expect(mockHttpRequestService.makeRequest).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          method: 'POST',
          url: expect.stringContaining('/generate/welcome-letter'),
          data: letterRequest,
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            Authorization: 'Bearer test-token',
            responseType: 'arraybuffer'
          })
        }),
      );
    });

    it('should throw UnprocessableEntityException on error', async () => {
      mockHttpRequestService.makeRequest.mockRejectedValueOnce(new Error());

      await expect(service.generateWelcomeLetter(letterRequest)).rejects.toThrow(
        UnprocessableEntityException,
      );
    });
  });
});
