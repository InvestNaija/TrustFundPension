import { Test, TestingModule } from '@nestjs/testing';
import { QoreIdService } from './qoreid.service';
import { HttpRequestService } from '../../../shared/http-request';
import { UnprocessableEntityException } from '@nestjs/common';

// Mock envConfig
jest.mock('../../../core/config', () => ({
  envConfig: {
    QOREID_BASE_URL: 'https://api.qoreid.com',
    QOREID_CLIENT_ID: 'test-client-id',
    QOREID_SECRET: 'test-secret',
  },
}));

describe('QoreIdService', () => {
  let service: QoreIdService;
  let httpRequestService: HttpRequestService;

  const mockHttpRequestService = {
    makeRequest: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QoreIdService,
        {
          provide: HttpRequestService,
          useValue: mockHttpRequestService,
        },
      ],
    }).compile();

    service = module.get<QoreIdService>(QoreIdService);
    httpRequestService = module.get<HttpRequestService>(HttpRequestService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('verifyNin', () => {
    const mockNin = '12345678901';
    const mockTokenResponse = {
      accessToken: 'test-access-token',
    };
    const mockNinResponse = {
      nin: {
        nin: '12345678901',
        firstname: 'John',
        lastname: 'Doe',
        phone: '08012345678',
        email: 'john.doe@example.com',
        emails: ['john.doe@example.com'],
      },
    };

    it('should successfully verify NIN', async () => {
      // Mock token initialization
      mockHttpRequestService.makeRequest.mockResolvedValueOnce(mockTokenResponse);
      // Mock NIN verification
      mockHttpRequestService.makeRequest.mockResolvedValueOnce(mockNinResponse);

      const result = await service.verifyNin(mockNin);

      expect(result).toEqual(mockNinResponse);
      expect(mockHttpRequestService.makeRequest).toHaveBeenCalledTimes(2);
      
      // Verify token request
      expect(mockHttpRequestService.makeRequest).toHaveBeenNthCalledWith(1, {
        method: 'POST',
        url: 'https://api.qoreid.com/token',
        data: {
          clientId: 'test-client-id',
          secret: 'test-secret',
        },
      });

      // Verify NIN request
      expect(mockHttpRequestService.makeRequest).toHaveBeenNthCalledWith(2, {
        method: 'POST',
        url: 'https://api.qoreid.com/v1/ng/identities/nin/12345678901',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test-access-token',
        },
      });
    });

    it('should throw UnprocessableEntityException when token initialization fails', async () => {
      mockHttpRequestService.makeRequest.mockRejectedValueOnce(new Error('Token initialization failed'));

      await expect(service.verifyNin(mockNin))
        .rejects
        .toThrow(UnprocessableEntityException);

      expect(mockHttpRequestService.makeRequest).toHaveBeenCalledTimes(1);
    });

    it('should throw UnprocessableEntityException when NIN verification fails', async () => {
      // Mock successful token initialization
      mockHttpRequestService.makeRequest.mockResolvedValueOnce(mockTokenResponse);
      // Mock failed NIN verification
      mockHttpRequestService.makeRequest.mockRejectedValueOnce(new Error('NIN verification failed'));

      await expect(service.verifyNin(mockNin))
        .rejects
        .toThrow(UnprocessableEntityException);

      expect(mockHttpRequestService.makeRequest).toHaveBeenCalledTimes(2);
    });

    it('should throw UnprocessableEntityException when API returns invalid NIN', async () => {
      // Mock successful token initialization
      mockHttpRequestService.makeRequest.mockResolvedValueOnce(mockTokenResponse);
      // Mock invalid NIN response
      mockHttpRequestService.makeRequest.mockResolvedValueOnce({
        nin: null,
      });

      await expect(service.verifyNin(mockNin))
        .rejects
        .toThrow(UnprocessableEntityException);

      expect(mockHttpRequestService.makeRequest).toHaveBeenCalledTimes(2);
    });
  });
}); 