import { Test, TestingModule } from '@nestjs/testing';
import { BvnService } from './bvn.service';
import { HttpRequestService } from '../../../shared/http-request/http-request.service';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../../user/services/user.service';
import { UnprocessableEntityException } from '@nestjs/common';
import { VerificationService } from '../../user/services/verification.service';
import { BvnDataService } from '../../user/services/bvn-data.service';

describe('BvnService', () => {
  let service: BvnService;
  let httpRequestService: HttpRequestService;
  let configService: ConfigService;
  let userService: UserService;
  let verificationService: VerificationService;
  let bvnDataService: BvnDataService;

  const mockHttpRequestService = {
    makeRequest: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  const mockUserService = {
    update: jest.fn(),
  };

  const mockVerificationService = {
    updateBvnVerification: jest.fn(),
  };

  const mockBvnDataService = {
    findOne: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BvnService,
        {
          provide: HttpRequestService,
          useValue: mockHttpRequestService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: VerificationService,
          useValue: mockVerificationService,
        },
        {
          provide: BvnDataService,
          useValue: mockBvnDataService,
        },
      ],
    }).compile();

    service = module.get<BvnService>(BvnService);
    httpRequestService = module.get<HttpRequestService>(HttpRequestService);
    configService = module.get<ConfigService>(ConfigService);
    userService = module.get<UserService>(UserService);
    verificationService = module.get<VerificationService>(VerificationService);
    bvnDataService = module.get<BvnDataService>(BvnDataService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('verifyBvn', () => {
    const mockBvnResponse = {
      data: {
        status: true,
        message: 'BVN verified successfully',
        data: {
          firstName: 'John',
          lastName: 'Doe',
          dateOfBirth: '1990-01-01',
        },
      },
    };

    beforeEach(() => {
      mockConfigService.get.mockReturnValue('https://api.bvn.com');
      mockHttpRequestService.makeRequest.mockResolvedValue(mockBvnResponse);
      mockUserService.update.mockResolvedValue({});
      mockBvnDataService.findOne.mockResolvedValue({
        bvnResponse: mockBvnResponse.data
      });
    });

    it('should verify BVN successfully', async () => {
      const result = await service.verifyBvn({ bvn: '12345678901' }, 'user-id');

      expect(result).toEqual({
        status: true,
        message: 'BVN verified successfully',
        data: mockBvnResponse.data,
      });
      expect(mockVerificationService.updateBvnVerification).toHaveBeenCalledWith('user-id', '12345678901');
    });

    it('should throw error if BVN verification fails', async () => {
      mockBvnDataService.findOne.mockResolvedValue(null);

      await expect(service.verifyBvn({ bvn: '12345678901' }, 'user-id')).rejects.toThrow(
        UnprocessableEntityException,
      );
    });
  });

  describe('getBvnDetails', () => {
    const mockBvnDetailsResponse = {
      data: {
        status: true,
        message: 'BVN details retrieved successfully',
        data: {
          firstName: 'John',
          lastName: 'Doe',
          dateOfBirth: '1990-01-01',
        },
      },
    };

    beforeEach(() => {
      mockConfigService.get.mockReturnValue('https://api.bvn.com');
      mockHttpRequestService.makeRequest.mockResolvedValue(mockBvnDetailsResponse);
      mockBvnDataService.findOne.mockResolvedValue(null);
    });

    it('should get BVN details successfully', async () => {
      const result = await service.getBvnDetails({
        bvn: '12345678901',
        firstName: 'John',
        lastName: 'Doe'
      }, 'user-id');

      expect(result).toEqual({
        status: true,
        message: 'BVN details retrieved successfully',
        data: expect.any(Object),
      });
      expect(mockBvnDataService.create).toHaveBeenCalled();
    });

    it('should return cached data if available', async () => {
      mockBvnDataService.findOne.mockResolvedValue({
        bvnResponse: mockBvnDetailsResponse.data
      });

      const result = await service.getBvnDetails({
        bvn: '12345678901',
        firstName: 'John',
        lastName: 'Doe'
      }, 'user-id');

      expect(result).toEqual({
        status: true,
        message: 'BVN details retrieved successfully from cache',
        data: mockBvnDetailsResponse.data,
      });
      expect(mockHttpRequestService.makeRequest).not.toHaveBeenCalled();
    });

    it('should throw error if getting BVN details fails', async () => {
      mockHttpRequestService.makeRequest.mockRejectedValue(new Error('Failed'));

      await expect(service.getBvnDetails({
        bvn: '12345678901',
        firstName: 'John',
        lastName: 'Doe'
      }, 'user-id')).rejects.toThrow(
        UnprocessableEntityException,
      );
    });
  });
}); 