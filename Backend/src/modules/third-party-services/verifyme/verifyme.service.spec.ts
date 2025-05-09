import { Test, TestingModule } from '@nestjs/testing';
import { VerifyMeService } from './verifyme.service';
import { HttpRequestService } from '../../../shared/http-request';
import { UnprocessableEntityException } from '@nestjs/common';

// Mock envConfig
jest.mock('../../../core/config', () => ({
  envConfig: {
    VERIFYME_BASE_URL: 'https://vapi.verifyme.ng/v1/verifications/identities/bvn',
    VERIFYME_SECRET_KEY: 'test-secret-key',
  },
}));

describe('VerifyMeService', () => {
  let service: VerifyMeService;
  let httpRequestService: HttpRequestService;

  const mockHttpRequestService = {
    makeRequest: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VerifyMeService,
        {
          provide: HttpRequestService,
          useValue: mockHttpRequestService,
        },
      ],
    }).compile();

    service = module.get<VerifyMeService>(VerifyMeService);
    httpRequestService = module.get<HttpRequestService>(HttpRequestService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('verifyBvn', () => {
    const mockBvn = '12345678901';
    const mockFirstName = 'John';
    const mockLastName = 'Doe';
    const mockResponse = {
      status: true,
      message: 'BVN verified successfully',
      data: {
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990-01-01',
        phoneNumber: '08012345678',
        email: 'john.doe@example.com',
      },
    };

    it('should successfully verify BVN', async () => {
      mockHttpRequestService.makeRequest.mockResolvedValueOnce(mockResponse);

      const result = await service.verifyBvn(mockBvn, mockFirstName, mockLastName);

      expect(result).toEqual(mockResponse);
      expect(mockHttpRequestService.makeRequest).toHaveBeenCalledWith({
        url: 'https://vapi.verifyme.ng/v1/verifications/identities/bvn/12345678901?type=premium',
        method: 'POST',
        headers: {
          'Authorization': 'Bearer test-secret-key',
          'Content-Type': 'application/json',
        },
        data: JSON.stringify({
          firstname: mockFirstName,
          lastname: mockLastName,
        }),
      });
    });

    it('should throw UnprocessableEntityException when verification fails', async () => {
      mockHttpRequestService.makeRequest.mockRejectedValueOnce(new Error('Verification failed'));

      await expect(service.verifyBvn(mockBvn, mockFirstName, mockLastName))
        .rejects
        .toThrow(UnprocessableEntityException);

      expect(mockHttpRequestService.makeRequest).toHaveBeenCalled();
    });

    it('should throw UnprocessableEntityException when API returns error', async () => {
      mockHttpRequestService.makeRequest.mockResolvedValueOnce({
        status: false,
        message: 'Invalid BVN',
      });

      await expect(service.verifyBvn(mockBvn, mockFirstName, mockLastName))
        .rejects
        .toThrow(UnprocessableEntityException);

      expect(mockHttpRequestService.makeRequest).toHaveBeenCalled();
    });
  });
}); 