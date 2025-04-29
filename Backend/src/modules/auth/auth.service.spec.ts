import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/services/user.service';
import { JwtService } from '@nestjs/jwt';
import { TrustFundService } from '../third-party-services/trustfund/trustfund.service';
import { BadRequestException, ConflictException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { USER_ROLE } from '../../core/constants';
import { VerificationMethod } from './dto';
import { Logger } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;
  let jwtService: JwtService;
  let trustFundService: TrustFundService;

  const mockUserService = {
    findByEmail: jest.fn(),
    findByPhone: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    generateSignedUrlsForUserFiles: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  const mockTrustFundService = {
    sendEmail: jest.fn(),
    sendSms: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: TrustFundService,
          useValue: mockTrustFundService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
    trustFundService = module.get<TrustFundService>(TrustFundService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signupUser', () => {
    const signupDto = {
      email: 'test@example.com',
      password: 'password123',
      first_name: 'John',
      last_name: 'Doe',
      middle_name: 'Middle',
      phone: '1234567890',
      bvn: '12345678901',
      nin: '12345678901',
      rsa_pin: 'PIN123',
      dob: '1990-01-01',
      gender: 'M',
      role: USER_ROLE.CLIENT,
    };

    const mockUser = {
      id: '123',
      email: 'test@example.com',
      password: 'hashedPassword',
      role: USER_ROLE.CLIENT,
      otpCodeHash: null,
      otpCodeExpiry: null,
    };

    it('should successfully register a new user', async () => {
      mockUserService.findByEmail.mockResolvedValue(null);
      mockUserService.create.mockResolvedValue(mockUser);

      const result = await service.signupUser(signupDto);

      expect(result).toEqual({
        status: true,
        message: 'Registration successful! Please verify your account',
        data: mockUser,
      });
      expect(mockUserService.findByEmail).toHaveBeenCalledWith(signupDto.email);
      expect(mockUserService.create).toHaveBeenCalled();
    });

    it('should throw ConflictException if user already exists', async () => {
      mockUserService.findByEmail.mockResolvedValue(mockUser);

      await expect(service.signupUser(signupDto)).rejects.toThrow(ConflictException);
      expect(mockUserService.create).not.toHaveBeenCalled();
    });
  });

  describe('verifyAccount', () => {
    const verifyEmailDto = {
      email: 'test@example.com',
      otpCode: '123456',
      method: VerificationMethod.EMAIL,
    };

    const verifyPhoneDto = {
      phone: '1234567890',
      otpCode: '123456',
      method: VerificationMethod.SMS,
    };

    const mockUser = {
      id: '123',
      email: 'test@example.com',
      phone: '1234567890',
      otpCodeHash: null,
      otpCodeExpiry: null,
      isEmailVerified: false,
      isPhoneVerified: false,
    };

    it('should verify account via email successfully', async () => {
      mockUserService.findByEmail.mockResolvedValue(mockUser);
      mockUserService.update.mockResolvedValue({ ...mockUser, isEmailVerified: true });

      const result = await service.verifyAccount(verifyEmailDto);

      expect(result).toEqual({
        status: true,
        message: `Account verified successfully via ${VerificationMethod.EMAIL}`,
        data: {},
      });
      expect(mockUserService.update).toHaveBeenCalledWith(mockUser.id, {
        otpCodeHash: null,
        otpCodeExpiry: null,
        isEmailVerified: true,
      });
    });

    it('should verify account via phone successfully', async () => {
      mockUserService.findByPhone.mockResolvedValue(mockUser);
      mockUserService.update.mockResolvedValue({ ...mockUser, isPhoneVerified: true });

      const result = await service.verifyAccount(verifyPhoneDto);

      expect(result).toEqual({
        status: true,
        message: `Account verified successfully via ${VerificationMethod.SMS}`,
        data: {},
      });
      expect(mockUserService.update).toHaveBeenCalledWith(mockUser.id, {
        otpCodeHash: null,
        otpCodeExpiry: null,
        isPhoneVerified: true,
      });
    });

    it('should throw BadRequestException if email is missing for email verification', async () => {
      const invalidDto = { ...verifyEmailDto, email: undefined };
      await expect(service.verifyAccount(invalidDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if phone is missing for SMS verification', async () => {
      const invalidDto = { ...verifyPhoneDto, phone: undefined };
      await expect(service.verifyAccount(invalidDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUserService.findByEmail.mockResolvedValue(null);
      await expect(service.verifyAccount(verifyEmailDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if OTP is invalid', async () => {
      mockUserService.findByEmail.mockResolvedValue(mockUser);
      const invalidDto = { ...verifyEmailDto, otpCode: '654321' };
      await expect(service.verifyAccount(invalidDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if OTP has expired', async () => {
      const expiredUser = {
        ...mockUser,
        otpCodeExpiry: new Date(Date.now() - 3600000), // 1 hour ago
      };
      mockUserService.findByEmail.mockResolvedValue(expiredUser);
      await expect(service.verifyAccount(verifyEmailDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('resendVerificationToken', () => {
    const resendEmailDto = {
      email: 'test@example.com',
      method: VerificationMethod.EMAIL,
    };

    const resendPhoneDto = {
      phone: '1234567890',
      method: VerificationMethod.SMS,
    };

    const mockUser = {
      id: '123',
      email: 'test@example.com',
      phone: '1234567890',
      first_name: 'John',
      isEmailVerified: false,
      isPhoneVerified: false,
    };

    it('should resend verification token via email successfully', async () => {
      mockUserService.findByEmail.mockResolvedValue(mockUser);
      mockUserService.update.mockResolvedValue(mockUser);
      mockTrustFundService.sendEmail.mockResolvedValue({ success: true });

      const result = await service.resendVerificationToken(resendEmailDto);

      expect(result).toEqual({
        status: true,
        message: `Verification token sent successfully via ${VerificationMethod.EMAIL}`,
        data: {
          email: mockUser.email,
          phone: mockUser.phone,
        },
      });
      expect(mockUserService.update).toHaveBeenCalled();
      expect(mockTrustFundService.sendEmail).toHaveBeenCalled();
    });

    it('should resend verification token via SMS successfully', async () => {
      mockUserService.findByPhone.mockResolvedValue(mockUser);
      mockUserService.update.mockResolvedValue(mockUser);
      mockTrustFundService.sendSms.mockResolvedValue({ success: true });

      const result = await service.resendVerificationToken(resendPhoneDto);

      expect(result).toEqual({
        status: true,
        message: `Verification token sent successfully via ${VerificationMethod.SMS}`,
        data: {
          email: mockUser.email,
          phone: mockUser.phone,
        },
      });
      expect(mockUserService.update).toHaveBeenCalled();
      expect(mockTrustFundService.sendSms).toHaveBeenCalled();
    });

    it('should throw BadRequestException if email is already verified', async () => {
      const verifiedUser = { ...mockUser, isEmailVerified: true };
      mockUserService.findByEmail.mockResolvedValue(verifiedUser);
      await expect(service.resendVerificationToken(resendEmailDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if phone is already verified', async () => {
      const verifiedUser = { ...mockUser, isPhoneVerified: true };
      mockUserService.findByPhone.mockResolvedValue(verifiedUser);
      await expect(service.resendVerificationToken(resendPhoneDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('login', () => {
    const loginDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    const mockUser = {
      id: '123',
      email: 'test@example.com',
      password: 'hashedPassword',
      role: USER_ROLE.CLIENT,
      otpCodeHash: null,
      otpCodeExpiry: null,
    };

    const mockTokens = {
      accessToken: 'access_token',
      refreshToken: 'refresh_token',
    };

    const mockSignedUrls = {
      profilePictureUrl: 'https://example.com/profile.jpg',
    };

    it('should login successfully', async () => {
      mockUserService.findByEmail.mockResolvedValue(mockUser);
      mockJwtService.signAsync.mockResolvedValue(mockTokens.accessToken);
      mockUserService.generateSignedUrlsForUserFiles.mockResolvedValue(mockSignedUrls);

      const result = await service.login(loginDto);

      expect(result).toEqual({
        ...mockUser,
        ...mockSignedUrls,
        tokens: mockTokens,
      });
      expect(mockJwtService.signAsync).toHaveBeenCalledTimes(2);
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockUserService.findByEmail.mockResolvedValue(null);
      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      mockUserService.findByEmail.mockResolvedValue(mockUser);
      const invalidDto = { ...loginDto, password: 'wrong_password' };
      await expect(service.login(invalidDto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('refreshUserToken', () => {
    const authenticatedUser = {
      id: '123',
      role: USER_ROLE.CLIENT,
    };

    const mockUser = {
      id: '123',
      email: 'test@example.com',
      role: USER_ROLE.CLIENT,
    };

    const mockTokens = {
      accessToken: 'new_access_token',
      refreshToken: 'new_refresh_token',
    };

    it('should refresh tokens successfully', async () => {
      mockUserService.findOne.mockResolvedValue(mockUser);
      mockJwtService.signAsync.mockResolvedValue(mockTokens.accessToken);

      const result = await service.refreshUserToken(authenticatedUser);

      expect(result).toEqual({
        email: mockUser.email,
        tokens: mockTokens,
      });
      expect(mockJwtService.signAsync).toHaveBeenCalledTimes(2);
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockUserService.findOne.mockResolvedValue(null);
      await expect(service.refreshUserToken(authenticatedUser)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('sendPasswordResetToken', () => {
    const resetTokenDto = {
      email: 'test@example.com',
    };

    const mockUser = {
      id: '123',
      email: 'test@example.com',
      first_name: 'John',
    };

    it('should send password reset token successfully', async () => {
      mockUserService.findByEmail.mockResolvedValue(mockUser);
      mockUserService.update.mockResolvedValue(mockUser);

      const result = await service.sendPasswordResetToken(resetTokenDto);

      expect(result).toEqual({
        status: true,
        message: 'Password reset token sent successfully',
        data: {
          email: mockUser.email,
        },
      });
      expect(mockUserService.update).toHaveBeenCalled();
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUserService.findByEmail.mockResolvedValue(null);
      await expect(service.sendPasswordResetToken(resetTokenDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('validateOtp', () => {
    const validateOtpDto = {
      email: 'test@example.com',
      otpCode: '123456',
    };

    const mockUser = {
      id: '123',
      email: 'test@example.com',
      otpCodeHash: null,
      otpCodeExpiry: null,
    };

    it('should validate OTP successfully', async () => {
      mockUserService.findByEmail.mockResolvedValue(mockUser);

      const result = await service.validateOtp(validateOtpDto);

      expect(result).toEqual({
        status: true,
        message: 'OTP validated successfully',
        data: {},
      });
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUserService.findByEmail.mockResolvedValue(null);
      await expect(service.validateOtp(validateOtpDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if OTP is invalid', async () => {
      mockUserService.findByEmail.mockResolvedValue(mockUser);
      const invalidDto = { ...validateOtpDto, otpCode: '654321' };
      await expect(service.validateOtp(invalidDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if OTP has expired', async () => {
      const expiredUser = {
        ...mockUser,
        otpCodeExpiry: new Date(Date.now() - 3600000), // 1 hour ago
      };
      mockUserService.findByEmail.mockResolvedValue(expiredUser);
      await expect(service.validateOtp(validateOtpDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('resetPassword', () => {
    const resetPasswordDto = {
      email: 'test@example.com',
      otpCode: '123456',
      password: 'new_password123',
    };

    const mockUser = {
      id: '123',
      email: 'test@example.com',
      otpCodeHash: null,
      otpCodeExpiry: null,
    };

    it('should reset password successfully', async () => {
      mockUserService.findByEmail.mockResolvedValue(mockUser);
      mockUserService.update.mockResolvedValue(mockUser);

      const result = await service.resetPassword(resetPasswordDto);

      expect(result).toEqual({
        status: true,
        message: 'Password reset successfully',
        data: {},
      });
      expect(mockUserService.update).toHaveBeenCalledWith(mockUser.id, {
        password: expect.any(String),
        passwordChangedAt: expect.any(Date),
        otpCodeHash: null,
        otpCodeExpiry: null,
      });
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUserService.findByEmail.mockResolvedValue(null);
      await expect(service.resetPassword(resetPasswordDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if OTP is invalid', async () => {
      mockUserService.findByEmail.mockResolvedValue(mockUser);
      const invalidDto = { ...resetPasswordDto, otpCode: '654321' };
      await expect(service.resetPassword(invalidDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if OTP has expired', async () => {
      const expiredUser = {
        ...mockUser,
        otpCodeExpiry: new Date(Date.now() - 3600000), // 1 hour ago
      };
      mockUserService.findByEmail.mockResolvedValue(expiredUser);
      await expect(service.resetPassword(resetPasswordDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('sendVerificationCode', () => {
    const sendEmailCodeDto = {
      email: 'test@example.com',
      method: VerificationMethod.EMAIL,
    };

    const sendPhoneCodeDto = {
      phone: '1234567890',
      method: VerificationMethod.SMS,
    };

    const mockUser = {
      id: '123',
      email: 'test@example.com',
      phone: '1234567890',
      first_name: 'John',
      isEmailVerified: false,
    };

    it('should send verification code via email successfully', async () => {
      mockUserService.findByEmail.mockResolvedValue(mockUser);
      mockUserService.update.mockResolvedValue(mockUser);
      mockTrustFundService.sendEmail.mockResolvedValue({ success: true });

      const result = await service.sendVerificationCode(sendEmailCodeDto);

      expect(result).toEqual({
        status: true,
        message: `Verification code sent successfully via ${VerificationMethod.EMAIL}`,
        data: {
          email: mockUser.email,
          phone: mockUser.phone,
        },
      });
      expect(mockUserService.update).toHaveBeenCalled();
      expect(mockTrustFundService.sendEmail).toHaveBeenCalled();
    });

    it('should send verification code via SMS successfully', async () => {
      mockUserService.findByPhone.mockResolvedValue(mockUser);
      mockUserService.update.mockResolvedValue(mockUser);
      mockTrustFundService.sendSms.mockResolvedValue({ success: true });

      const result = await service.sendVerificationCode(sendPhoneCodeDto);

      expect(result).toEqual({
        status: true,
        message: `Verification code sent successfully via ${VerificationMethod.SMS}`,
        data: {
          email: mockUser.email,
          phone: mockUser.phone,
        },
      });
      expect(mockUserService.update).toHaveBeenCalled();
      expect(mockTrustFundService.sendSms).toHaveBeenCalled();
    });

    it('should throw BadRequestException if email is missing for email verification', async () => {
      const invalidDto = { ...sendEmailCodeDto, email: undefined };
      await expect(service.sendVerificationCode(invalidDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if phone is missing for SMS verification', async () => {
      const invalidDto = { ...sendPhoneCodeDto, phone: undefined };
      await expect(service.sendVerificationCode(invalidDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUserService.findByEmail.mockResolvedValue(null);
      await expect(service.sendVerificationCode(sendEmailCodeDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if account is already verified', async () => {
      const verifiedUser = { ...mockUser, isEmailVerified: true };
      mockUserService.findByEmail.mockResolvedValue(verifiedUser);
      await expect(service.sendVerificationCode(sendEmailCodeDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('sendEmailVerificationOTP', () => {
    it('should log success when email is sent', async () => {
      const emailDto = {
        to: 'test@example.com',
        subject: 'Verify Your Account',
        body: 'Your verification code is: 123456',
      };

      mockTrustFundService.sendEmail.mockResolvedValue({ success: true });
      
      // Spy on the logger
      const loggerSpy = jest.spyOn(Logger.prototype, 'log');
      
      // Call the private method using any type assertion
      await (service as any).sendEmailVerificationOTP(emailDto);
      
      expect(mockTrustFundService.sendEmail).toHaveBeenCalledWith(emailDto);
      expect(loggerSpy).toHaveBeenCalledWith(`Email verification OTP sent to ${emailDto.to}`);
    });

    it('should log error when email sending fails', async () => {
      const emailDto = {
        to: 'test@example.com',
        subject: 'Verify Your Account',
        body: 'Your verification code is: 123456',
      };

      const error = new Error('Failed to send email');
      mockTrustFundService.sendEmail.mockRejectedValue(error);
      
      // Spy on the logger
      const loggerSpy = jest.spyOn(Logger.prototype, 'error');
      
      // Call the private method using any type assertion
      await (service as any).sendEmailVerificationOTP(emailDto);
      
      expect(mockTrustFundService.sendEmail).toHaveBeenCalledWith(emailDto);
      expect(loggerSpy).toHaveBeenCalledWith(`Failed to send email verification OTP: ${error.message}`);
    });
  });

  describe('sendSmsVerificationOTP', () => {
    it('should log success when SMS is sent', async () => {
      const smsDto = {
        msisdn: '1234567890',
        msg: 'Your verification code is: 123456',
      };

      mockTrustFundService.sendSms.mockResolvedValue({ success: true });
      
      // Spy on the logger
      const loggerSpy = jest.spyOn(Logger.prototype, 'log');
      
      // Call the private method using any type assertion
      await (service as any).sendSmsVerificationOTP(smsDto);
      
      expect(mockTrustFundService.sendSms).toHaveBeenCalledWith(smsDto);
      expect(loggerSpy).toHaveBeenCalledWith(`SMS verification OTP sent to ${smsDto.msisdn}`);
    });

    it('should log error when SMS sending fails', async () => {
      const smsDto = {
        msisdn: '1234567890',
        msg: 'Your verification code is: 123456',
      };

      const error = new Error('Failed to send SMS');
      mockTrustFundService.sendSms.mockRejectedValue(error);
      
      // Spy on the logger
      const loggerSpy = jest.spyOn(Logger.prototype, 'error');
      
      // Call the private method using any type assertion
      await (service as any).sendSmsVerificationOTP(smsDto);
      
      expect(mockTrustFundService.sendSms).toHaveBeenCalledWith(smsDto);
      expect(loggerSpy).toHaveBeenCalledWith(`Failed to send SMS verification OTP: ${error.message}`);
    });
  });
}); 