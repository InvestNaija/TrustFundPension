import { Test, TestingModule } from '@nestjs/testing';
import { ReferralService } from './referral.service';
import { ReferralRepository } from '../repositories/referral.repository';
import { UserService } from '../../user/services/user.service';
import { NotFoundException } from '@nestjs/common';
import { User } from '../../user/entities/user.entity';
import { Referral } from '../entities/referral.entity';

describe('ReferralService', () => {
  let service: ReferralService;
  let referralRepository: ReferralRepository;
  let userService: UserService;

  const mockReferralRepository = {
    save: jest.fn(),
    findOne: jest.fn(),
  };

  const mockUserService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReferralService,
        {
          provide: ReferralRepository,
          useValue: mockReferralRepository,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    service = module.get<ReferralService>(ReferralService);
    referralRepository = module.get<ReferralRepository>(ReferralRepository);
    userService = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('generateCode', () => {
    const ownerId = 'owner-id';
    const referrerId = 'referrer-id';
    const mockOwner = { id: ownerId } as User;
    const mockReferrer = { id: referrerId } as User;
    const mockReferral = { code: 'ABC123', owner: mockOwner, referrer: mockReferrer } as Referral;

    it('should generate a referral code for a user', async () => {
      mockUserService.findOne.mockResolvedValueOnce(mockOwner);
      mockReferralRepository.save.mockResolvedValueOnce(mockReferral);

      const result = await service.generateCode({ ownerId });

      expect(mockUserService.findOne).toHaveBeenCalledWith(ownerId);
      expect(mockReferralRepository.save).toHaveBeenCalled();
      expect(result).toEqual(mockReferral);
      expect(result.code).toBeDefined();
      expect(result.code.length).toBe(6);
    });

    it('should generate a referral code with a referrer', async () => {
      mockUserService.findOne
        .mockResolvedValueOnce(mockOwner)
        .mockResolvedValueOnce(mockReferrer);
      mockReferralRepository.save.mockResolvedValueOnce(mockReferral);

      const result = await service.generateCode({ ownerId, referrerId });

      expect(mockUserService.findOne).toHaveBeenCalledTimes(2);
      expect(mockReferralRepository.save).toHaveBeenCalled();
      expect(result).toEqual(mockReferral);
      expect(result.code).toBeDefined();
      expect(result.code.length).toBe(6);
    });

    it('should throw NotFoundException if owner not found', async () => {
      mockUserService.findOne.mockResolvedValueOnce(null);

      await expect(service.generateCode({ ownerId })).rejects.toThrow(NotFoundException);
      expect(mockReferralRepository.save).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if referrer not found', async () => {
      mockUserService.findOne
        .mockResolvedValueOnce(mockOwner)
        .mockResolvedValueOnce(null);

      await expect(service.generateCode({ ownerId, referrerId })).rejects.toThrow(NotFoundException);
      expect(mockReferralRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('getMyReferralCode', () => {
    const userId = 'user-id';
    const mockReferral = { code: 'ABC123' } as Referral;

    it('should return the user\'s referral code', async () => {
      mockReferralRepository.findOne.mockResolvedValueOnce(mockReferral);

      const result = await service.getMyReferralCode(userId);

      expect(mockReferralRepository.findOne).toHaveBeenCalledWith({
        where: { owner: { id: userId } },
        relations: ['owner', 'referrer'],
      });
      expect(result).toEqual(mockReferral);
    });

    it('should throw NotFoundException if referral code not found', async () => {
      mockReferralRepository.findOne.mockResolvedValueOnce(null);

      await expect(service.getMyReferralCode(userId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByCode', () => {
    const code = 'ABC123';
    const mockReferral = { code } as Referral;

    it('should return the referral by code', async () => {
      mockReferralRepository.findOne.mockResolvedValueOnce(mockReferral);

      const result = await service.findByCode(code);

      expect(mockReferralRepository.findOne).toHaveBeenCalledWith({
        where: { code },
        relations: ['owner', 'referrer'],
      });
      expect(result).toEqual(mockReferral);
    });

    it('should throw NotFoundException if referral code not found', async () => {
      mockReferralRepository.findOne.mockResolvedValueOnce(null);

      await expect(service.findByCode(code)).rejects.toThrow(NotFoundException);
    });
  });
}); 