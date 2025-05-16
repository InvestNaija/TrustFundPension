import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import {
  LoginDto,
  ResendVerificationTokenDto,
  ResetPasswordDto,
  SendPasswordResetTokenDto,
  SendVerificationCodeDto,
  SignupUserDto,
  ValidateOtpDto,
  VerifyAccountDto,
  VerificationMethod,
  SendCodeDto,
} from './dto';
import { JwtService } from '@nestjs/jwt';
import { envConfig } from '../../core/config';
import { USER_ROLE } from '../../core/constants';
import { IApiResponse } from '../../core/types';
import { TrustFundService } from '../third-party-services/trustfund';
import {
  generateOtpCodeHash,
  generateOtpDetails,
  hashPassword,
  verifyPassword,
} from '../../shared/utils';
import { UserService } from '../user/services';
import { IDecodedJwtToken } from './strategies/types';
import {
  IEmailRequest,
  ISmsRequest,
} from '../third-party-services/trustfund/types';

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly trustFundService: TrustFundService
  ) {}

  async signupUser(dto: SignupUserDto): Promise<IApiResponse> {
    const existingUser = await this.userService.findByEmail(dto.email);

    if (existingUser) {
      throw new ConflictException(
        'A user with this email address already exists. Please use a different email address.',
      );
    }

    const hashedPassword = await hashPassword(dto.password);
    if (!hashedPassword) {
      throw new BadRequestException('Failed to hash password');
    }
    const { ...userData } = dto;
    const user = await this.userService.create({
      ...userData,
      password: hashedPassword,
      account_type: dto.accountType || undefined,
    });

    return {
      status: true,
      message: 'Registration successful! Please verify your account',
      data: user,
    };
  }

  async verifyAccount(dto: VerifyAccountDto): Promise<IApiResponse> {
    let user;
    
    if (dto.method === VerificationMethod.EMAIL) {
      if (!dto.email) {
        throw new BadRequestException('Email is required for email verification');
      }
      user = await this.userService.findByEmail(dto.email);
      if (!user) {
        throw new NotFoundException('User not found with this email');
      }
    } else {
      if (!dto.phone) {
        throw new BadRequestException('Phone number is required for SMS verification');
      }
      user = await this.userService.findByPhone(dto.phone);
      if (!user) {
        throw new NotFoundException('User not found with this phone number');
      }
    }

    const updateData: any = {};

    if (dto.method === VerificationMethod.EMAIL) {
      updateData.isEmailVerified = true;
      this.logger.log(`Email verification successful for user: ${user.email}`);
    } else {
      updateData.isPhoneVerified = true;
      this.logger.log(`Phone verification successful for user: ${user.phone}`);
    }

    await this.userService.update(user.id, updateData);

    return {
      status: true,
      message: `Account verified successfully via ${dto.method}`,
      data: {},
    };
  }

  async resendVerificationToken(
    dto: ResendVerificationTokenDto,
  ): Promise<IApiResponse> {
    let user;
    
    if (dto.method === VerificationMethod.EMAIL) {
      if (!dto.email) {
        throw new BadRequestException('Email is required for email verification');
      }
      user = await this.userService.findByEmail(dto.email);
      if (!user) {
        throw new NotFoundException('User not found with this email');
      }
      if (user.isEmailVerified) {
        throw new BadRequestException('Your email has already been verified');
      }
    } else {
      if (!dto.phone) {
        throw new BadRequestException('Phone number is required for SMS verification');
      }
      user = await this.userService.findByPhone(dto.phone);
      if (!user) {
        throw new NotFoundException('User not found with this phone number');
      }
      if (user.isPhoneVerified) {
        throw new BadRequestException('Your phone number has already been verified');
      }
    }

    const { otpCode, otpCodeHash, otpCodeExpiry } = generateOtpDetails();
    await this.userService.update(user.id, { otpCodeHash, otpCodeExpiry });

    if (dto.method === VerificationMethod.EMAIL) {
      this.sendEmailVerificationOTP({
        to: user.email,
        subject: 'Verify Your Account',
        body: `Hello ${user.first_name}, your verification code is: ${otpCode}. Please use this code to verify your account.`,
      });
    } else {
      this.sendSmsVerificationOTP({
        msisdn: user.phone,
        msg: `Hello ${user.first_name}, your verification code is: ${otpCode}. Please use this code to verify your account.`,
      });
    }

    return {
      status: true,
      message: `Verification token sent successfully via ${dto.method}`,
      data: {
        email: user.email,
        phone: user.phone,
      },
    };
  }

  async login(dto: LoginDto) {
    dto.validateLoginMethod();

    let user;
    if (dto.email) {
      user = await this.userService.findByEmail(dto.email);
    } else if (dto.rsaPin) {
      user = await this.userService.findByRsaPin(dto.rsaPin);
    } else if (dto.phone) {
      user = await this.userService.findByPhone(dto.phone);
    }

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValidPassword = await verifyPassword(dto.password, user.password);
    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isEmailVerified && !user.isPhoneVerified) {
      throw new BadRequestException('Please verify your account');
    }

    const tokens = await this.generateJwtTokens({
      id: user.id,
      userRoles: user.userRoles,
    });

    const signedUrls = await this.userService.generateSignedUrlsForUserFiles(user);

    return {
      ...user,
      ...signedUrls,
      tokens,
    };
  }

  async refreshUserToken(authenticatedUser: IDecodedJwtToken) {
    const user = await this.userService.findOne(authenticatedUser.id);
    if (!user) throw new UnauthorizedException('Invalid refresh token');

    const tokens = await this.generateJwtTokens({
      id: user.id,
      userRoles: user.userRoles,
    });

    return {
      email: user.email,
      tokens,
    };
  }

  async sendPasswordResetToken(
    dto: SendPasswordResetTokenDto,
  ): Promise<IApiResponse> {
    let user;
    
    if (dto.method === VerificationMethod.EMAIL) {
      if (!dto.email) {
        throw new BadRequestException('Email is required for email verification');
      }
      user = await this.userService.findByEmail(dto.email);
    } else {
      if (!dto.phone) {
        throw new BadRequestException('Phone number is required for SMS verification');
      }
      user = await this.userService.findByPhone(dto.phone);
    }

    if (!user) throw new NotFoundException('User not found');

    const { otpCode, otpCodeHash, otpCodeExpiry } = generateOtpDetails();
    await this.userService.update(user.id, { otpCodeHash, otpCodeExpiry });

    if (dto.method === VerificationMethod.EMAIL) {
      this.sendEmailVerificationOTP({
        to: user.email,
        subject: 'Password Reset',
        body: `Hello ${user.first_name}, your password reset code is: ${otpCode}. Please use this code to reset your password.`,
      });
    } else {
      this.sendSmsVerificationOTP({
        msisdn: user.phone,
        msg: `Hello ${user.first_name}, your password reset code is: ${otpCode}. Please use this code to reset your password.`,
      });
    }

    return {
      status: true,
      message: 'Password reset token sent successfully',
      data: {
        email: user.email,
        phone: user.phone,
      },
    };
  }

  async validateOtp(dto: ValidateOtpDto): Promise<IApiResponse> {
    const { email, otpCode } = dto;

    const user = await this.userService.findByEmail(email);
    if (!user) throw new NotFoundException('User not found');

    const otpCodeHash = generateOtpCodeHash(otpCode);
    if (otpCodeHash !== user.otpCodeHash) {
      throw new BadRequestException('Invalid OTP');
    }

    if (!user.otpCodeExpiry || new Date() > user.otpCodeExpiry) {
      throw new BadRequestException('OTP has expired');
    }

    return {
      status: true,
      message: 'OTP validated successfully',
      data: {},
    };
  }

  async resetPassword(dto: ResetPasswordDto): Promise<IApiResponse> {
    const { email, phone, password } = dto;

    if (!email && !phone) {
      throw new UnprocessableEntityException('Either email or phone must be provided');
    }

    let user;
    if (email) {
      user = await this.userService.findByEmail(email);
    } else if (phone) {
      user = await this.userService.findByPhone(phone);
    }

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Hash new password
    const hashedPassword = await hashPassword(password);

    // Update user password and clear OTP
    await this.userService.update(user.id, {
      password: hashedPassword,
      passwordChangedAt: new Date(),
    });

    return {
      status: true,
      message: 'Password reset successful',
      data: {},
    };
  }

  async sendVerificationCode(dto: SendVerificationCodeDto): Promise<IApiResponse> {
    let user;
    
    if (dto.method === VerificationMethod.EMAIL) {
      if (!dto.email) {
        throw new BadRequestException('Email is required for email verification');
      }
      user = await this.userService.findByEmail(dto.email);
      if (!user) {
        throw new NotFoundException('User not found with this email');
      }
    } else {
      if (!dto.phone) {
        throw new BadRequestException('Phone number is required for SMS verification');
      }
      user = await this.userService.findByPhone(dto.phone);
      if (!user) {
        throw new NotFoundException('User not found with this phone number');
      }
    }

    if (user.isEmailVerified || user.isPhoneVerified) {
      throw new BadRequestException('Your account has already been verified');
    }

    const { otpCode, otpCodeHash, otpCodeExpiry } = generateOtpDetails();
    await this.userService.update(user.id, { otpCodeHash, otpCodeExpiry });

    if (dto.method === VerificationMethod.EMAIL) {
      this.sendEmailVerificationOTP({
        to: user.email,
        subject: 'Verify Your Account',
        body: `Hello ${user.first_name}, your verification code is: ${otpCode}. Please use this code to verify your account.`,
      });
    } else {
      this.sendSmsVerificationOTP({
        msisdn: user.phone,
        msg: `Hello ${user.first_name}, your verification code is: ${otpCode}. Please use this code to verify your account.`,
      });
    }

    return {
      status: true,
      message: `Verification code sent successfully via ${dto.method}`,
      data: {
        email: user.email,
        phone: user.phone,
      },
    };
  }

  async sendCode(userId: string, dto: SendCodeDto): Promise<IApiResponse> {
    const { otpCode, otpCodeHash, otpCodeExpiry } = generateOtpDetails();

    await this.userService.update(userId, { otpCodeHash, otpCodeExpiry });
    
    let message: string;
    if (dto.context === 'bvn') {
      message = `Your BVN verification code is: ${otpCode}`;
    } else {
      message = `Your NIN verification code is: ${otpCode}`;
    }
    
    if (dto.method === VerificationMethod.EMAIL) {
      if (!dto.email) throw new BadRequestException('Email is required');
      await this.trustFundService.sendEmail({
        to: dto.email,
        subject: 'Verification Code',
        body: message,
      });
    } else {
      if (!dto.phone) throw new BadRequestException('Phone is required');
      await this.trustFundService.sendSms({
        msisdn: dto.phone,
        msg: message,
      });
    }

    return {
      status: true,
      message: `Verification code sent successfully via ${dto.method}`,
      data: {
        email: dto.email,
        phone: dto.phone,
        context: dto.context,
      },
    };
  }

  private async generateJwtTokens(
    payload: { id: string; userRoles: any[] },
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: envConfig.JWT_ACCESS_TOKEN_SECRET,
        expiresIn: envConfig.JWT_ACCESS_TOKEN_EXPIRY,
      }),
      this.jwtService.signAsync(payload, {
        secret: envConfig.JWT_REFRESH_TOKEN_SECRET,
        expiresIn: envConfig.JWT_REFRESH_TOKEN_EXPIRY,
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  private sendEmailVerificationOTP(
    dto: IEmailRequest
  ): void {
    this.trustFundService.sendEmail(dto)
      .then(() => {
        this.logger.log(`Email verification OTP sent to ${dto.to}`);
      })
      .catch((error) => {
        this.logger.error(`Failed to send email verification OTP: ${error.message}`);
      });
  }

  private sendSmsVerificationOTP(
   dto: ISmsRequest
  ): void {
    this.trustFundService.sendSms(dto)
      .then(() => {
        this.logger.log(`SMS verification OTP sent to ${dto.msisdn}`);
      })
      .catch((error) => {
        this.logger.error(`Failed to send SMS verification OTP: ${error.message}`);
      });
  }
}
