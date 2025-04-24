import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  LoginDto,
  ResendEmailVerificationTokenDto,
  ResetPasswordDto,
  SendPasswordResetTokenDto,
  SignupUserDto,
  ValidateOtpDto,
  VerifyEmailDto,
} from './dto';
import { JwtService } from '@nestjs/jwt';
import { envConfig } from '../../core/config';
import { USER_ROLE } from '../../core/constants';
import { IApiResponse } from '../../core/types';
import {
  generateOtpCodeHash,
  generateOtpDetails,
  hashPassword,
  verifyPassword,
} from '../../shared/utils';
import { UserService } from '../user/services';
import { IDecodedJwtToken } from '../../core/decorators/authenticated-user.decorator';

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
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

    const { otpCode, otpCodeHash, otpCodeExpiry } = generateOtpDetails();

    const user = await this.userService.create({
      ...dto,
      password: hashedPassword,
      otpCodeHash,
      otpCodeExpiry,
    });

    this.sendEmailVerificationOTP(user.first_name, user.email, otpCode);

    return {
      status: true,
      message:
        'Registration successful! Please check your email for a verification code to complete your account setup',
      data: user,
    };
  }

  async verifyEmail(dto: VerifyEmailDto): Promise<IApiResponse> {
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

    await this.userService.update(user.id, {
      isEmailVerified: true,
      otpCodeHash: null,
      otpCodeExpiry: null,
    });

    return {
      status: true,
      message: 'Email verified successfully',
      data: {},
    };
  }

  async resendEmailVerificationToken(
    dto: ResendEmailVerificationTokenDto,
  ): Promise<IApiResponse> {
    const { email } = dto;

    const user = await this.userService.findByEmail(email);
    if (!user) throw new NotFoundException('User not found');

    if (user.isEmailVerified) {
      throw new BadRequestException('Your email has already been verified');
    }

    const { otpCode, otpCodeHash, otpCodeExpiry } = generateOtpDetails();
    await this.userService.update(user.id, { otpCodeHash, otpCodeExpiry });

    // Trigger event to send OTP verification email
    this.sendEmailVerificationOTP(user.first_name, user.email, otpCode);

    return {
      status: true,
      message: 'Email verification token sent successfully',
      data: {
        email: user.email,
      },
    };
  }

  async login(dto: LoginDto) {
    const { email, password } = dto;

    const user = await this.userService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isValidPassword = await verifyPassword(password, user.password);
    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.generateJwtTokens({
      id: user.id,
      role: user.role,
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
      role: user.role,
    });

    return {
      email: user.email,
      tokens,
    };
  }

  async sendPasswordResetToken(
    dto: SendPasswordResetTokenDto,
  ): Promise<IApiResponse> {
    const { email } = dto;

    const user = await this.userService.findByEmail(email);
    if (!user) throw new NotFoundException('User not found');

    const { otpCode, otpCodeHash, otpCodeExpiry } = generateOtpDetails();
    await this.userService.update(user.id, { otpCodeHash, otpCodeExpiry });

    // this.eventPublisherService.publishSendEmail({
    //   to: user.email,
    //   subject: 'Reset Your Password',
    //   template: EMAIL_TEMPLATE.PASSWORD_RESET_OTP,
    //   templateData: { name: user.first_name, otp: otpCode },
    // });

    return {
      status: true,
      message: 'Password reset token sent successfully',
      data: {
        email: user.email,
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
    const { email, otpCode, password } = dto;

    const user = await this.userService.findByEmail(email);
    if (!user) throw new NotFoundException('User not found');

    const otpCodeHash = generateOtpCodeHash(otpCode);
    if (otpCodeHash !== user.otpCodeHash) {
      throw new BadRequestException('Invalid OTP');
    }

    if (!user.otpCodeExpiry || new Date() > user.otpCodeExpiry) {
      throw new BadRequestException('OTP has expired');
    }

    const hashedPassword = await hashPassword(password);
    await this.userService.update(user.id, {
      password: hashedPassword,
      passwordChangedAt: new Date(),
      otpCodeHash: null,
      otpCodeExpiry: null,
    });

    return {
      status: true,
      message: 'Password reset successfully',
      data: {},
    };
  }

  private async generateJwtTokens(
    payload: { id: string; role: USER_ROLE },
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: envConfig.JWT_ACCESS_TOKEN_SECRET,
      expiresIn: envConfig.JWT_ACCESS_TOKEN_EXPIRY,
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: envConfig.JWT_REFRESH_TOKEN_SECRET,
      expiresIn: envConfig.JWT_REFRESH_TOKEN_EXPIRY,
    });

    return { accessToken, refreshToken };
  }

  private sendEmailVerificationOTP(
    name: string,
    email: string,
    otp: string,
  ): void {
    // this.eventPublisherService.publishSendEmail({
    //   to: email,
    //   subject: 'Verify Your Account',
    //   template: EMAIL_TEMPLATE.EMAIL_VERIFICATION_OTP,
    //   templateData: { name, otp },
    // });
  }
}
