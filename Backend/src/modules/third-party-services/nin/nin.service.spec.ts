import { Test, TestingModule } from '@nestjs/testing';
import { NinService } from './nin.service';
import { HttpRequestService } from '../../../shared/http-request/http-request.service';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../../user/services/user.service';
import { UnprocessableEntityException } from '@nestjs/common';
import { VerificationService } from '../../user/services/verification.service';

// Mock envConfig
jest.mock('../../../core/config', () => ({
  envConfig: {
    QOREID_BASE_URL: 'https://api.qoreid.com',
    QOREID_SECRET: 'test-secret',
    QOREID_CLIENT_ID: 'test-client-id',
  },
}));

describe('NinService', () => {
  let service: NinService;
  let httpRequestService: HttpRequestService;
  let verificationService: VerificationService;

  const mockHttpRequestService = {
    makeRequest: jest.fn(),
  };

  const mockVerificationService = {
    updateNinVerification: jest.fn(),
  };

  beforeEach(async () => {
    // Mock successful token initialization
    mockHttpRequestService.makeRequest.mockResolvedValueOnce({
      accessToken: 'test-token',
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NinService,
        {
          provide: HttpRequestService,
          useValue: mockHttpRequestService,
        },
        {
          provide: VerificationService,
          useValue: mockVerificationService,
        },
      ],
    }).compile();

    service = module.get<NinService>(NinService);
    httpRequestService = module.get<HttpRequestService>(HttpRequestService);
    verificationService = module.get<VerificationService>(VerificationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('verifyNin', () => {
    it('should verify NIN successfully', async () => {
      mockVerificationService.updateNinVerification.mockResolvedValue({
        status: true,
        message: 'NIN successfully verified',
      });

      const result = await service.verifyNin('12345678901', 'user-id');

      expect(result).toEqual({
        status: true,
        message: 'NIN successfully verified',
      });
      expect(mockVerificationService.updateNinVerification).toHaveBeenCalledWith('user-id', '12345678901');
    });

    it('should throw error if NIN verification fails', async () => {
      mockVerificationService.updateNinVerification.mockRejectedValue(new Error('Failed'));

      await expect(service.verifyNin('12345678901', 'user-id')).rejects.toThrow(
        UnprocessableEntityException,
      );
    });
  });

  describe('getNinDetails', () => {
    const mockNinResponse = {
      nin: {
        nin: '12345678901',
        firstname: 'John',
        lastname: 'Doe',
        phone: '1234567890',
        email: 'john@example.com',
        emails: ['john2@example.com'],
      },
    };

    beforeEach(() => {
      mockHttpRequestService.makeRequest.mockResolvedValue(mockNinResponse);
    });

    it('should get NIN details successfully', async () => {
      const result = await service.getNinDetails('12345678901');

      expect(result).toEqual({
        status: true,
        message: 'NIN verified successfully',
        data: {
          nin: '12345678901',
          firstname: 'John',
          lastname: 'Doe',
          phones: ['1234567890'],
          emails: ['john@example.com', 'john2@example.com'],
        },
      });
    });

    it('should throw error if getting NIN details fails', async () => {
      mockHttpRequestService.makeRequest.mockRejectedValue(new Error('Failed'));

      await expect(service.getNinDetails('12345678901')).rejects.toThrow(
        UnprocessableEntityException,
      );
    });

    it('should throw error if NIN data is not present in response', async () => {
      mockHttpRequestService.makeRequest.mockResolvedValue({});

      await expect(service.getNinDetails('12345678901')).rejects.toThrow(
        UnprocessableEntityException,
      );
    });
  });
}); 