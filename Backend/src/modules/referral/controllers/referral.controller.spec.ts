import { Test, TestingModule } from '@nestjs/testing';
import { ReferralController } from './referral.controller';
import { ReferralService } from '../services/referral.service';
import { JwtModule } from '@nestjs/jwt';
import { envConfig } from '../../../core/config';
import { USER_ROLE } from '../../../core/constants';
import { CreateReferralDto } from '../dto/create-referral.dto';

describe('ReferralController', () => {
  let controller: ReferralController;
  let service: ReferralService;

  const mockReferralService = {
    generateCode: jest.fn(),
    getMyReferralCode: jest.fn(),
  };

  const mockAuthenticatedUser = {
    id: '1',
    email: 'test@example.com',
    role: USER_ROLE.CLIENT,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: envConfig.JWT_ACCESS_TOKEN_SECRET,
          signOptions: { expiresIn: envConfig.JWT_ACCESS_TOKEN_EXPIRY },
        }),
      ],
      controllers: [ReferralController],
      providers: [
        {
          provide: ReferralService,
          useValue: mockReferralService,
        },
      ],
    }).compile();

    controller = module.get<ReferralController>(ReferralController);
    service = module.get<ReferralService>(ReferralService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('generate', () => {
    it('should generate a referral code', async () => {
      const mockReferral = {
        id: '1',
        code: 'TEST123',
        owner: mockAuthenticatedUser,
      };

      const createReferralDto: CreateReferralDto = {
        referrerId: 'referrer-id',
        ownerId: mockAuthenticatedUser.id,
      };

      mockReferralService.generateCode.mockResolvedValue(mockReferral);

      const result = await controller.generate(
        { user: mockAuthenticatedUser },
        createReferralDto,
        mockAuthenticatedUser,
      );

      expect(mockReferralService.generateCode).toHaveBeenCalledWith({
        ...createReferralDto,
        ownerId: mockAuthenticatedUser.id,
      });
      expect(result).toEqual(mockReferral);
    });
  });

  describe('getMyCode', () => {
    it('should return the user\'s referral code', async () => {
      const mockReferral = {
        id: '1',
        code: 'TEST123',
        owner: mockAuthenticatedUser,
      };

      mockReferralService.getMyReferralCode.mockResolvedValue(mockReferral);

      const result = await controller.getMyCode(
        { user: mockAuthenticatedUser },
        mockAuthenticatedUser,
      );

      expect(mockReferralService.getMyReferralCode).toHaveBeenCalledWith(mockAuthenticatedUser.id);
      expect(result).toEqual(mockReferral);
    });
  });
}); 