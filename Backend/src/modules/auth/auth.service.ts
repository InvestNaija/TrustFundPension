import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  AgentRegistrationDto,
  LoginDto,
  ResendEmailVerificationTokenDto,
  ResetPasswordDto,
  SendPasswordResetTokenDto,
  ValidateOtpDto,
  VerifyEmailDto,
} from './dto';

import { JwtService } from '@nestjs/jwt';
import { envConfig } from '../../core/config';
import { EMAIL_TEMPLATE, USER_ROLE } from '../../core/constants';
import { IApiResponse } from '../../core/types';
import {
  generateOtpCodeHash,
  generateOtpDetails,
  hashPassword,
  verifyPassword,
} from '../../shared/utils';
import { UserService } from '../user/services';
import { AGENT_ACCOUNT_TYPE } from '../user/types';
import { UserFactory } from '../user/user-factory';
import { IDecodedJwtToken } from './strategies';
import { EventPublisherService } from '../event';

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);

  constructor(
    private readonly userFactory: UserFactory,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly eventPublisherService: EventPublisherService,
  ) {}

  async signupAgent(dto: AgentRegistrationDto): Promise<IApiResponse> {
    const userRepository = this.userFactory.getRepository(USER_ROLE.AGENT);

    const existingAgent = await userRepository.findOne({
      where: { email: dto.email },
    });

    if (existingAgent) {
      throw new ConflictException(
        'An agent with this email address already exists. Please use a different email address.',
      );
    }

    // Clean up payload for individual accounts
    // This ensures data consistency even if frontend validation is bypassed
    if (dto.accountType === AGENT_ACCOUNT_TYPE.INDIVIDUAL) {
      if ('businessCertificateUrl' in dto) delete dto.businessCertificateUrl;
      if ('companyName' in dto) delete dto.companyName;
    }

    // Hash password B4 saving to DB
    const hashedPassword = await hashPassword(dto.password);

    // Generate OTP details for email verification
    const { otpCode, otpCodeHash, otpCodeExpiry } = generateOtpDetails();

    const user = await userRepository.save({
      ...dto,
      role: USER_ROLE.AGENT,
      password: hashedPassword,
      otpCodeHash,
      otpCodeExpiry,
    });

    // Trigger event to send OTP verification email
    this.sendEmailVerificationOTP(user.firstName, user.email, otpCode);

    return {
      status: true,
      message:
        'Registration successful! Please check your email for a verification code to complete your account setup',
      data: user,
    };
  }

  async verifyEmail(dto: VerifyEmailDto): Promise<IApiResponse> {
    const { email, otpCode, role } = dto;

    const userRepository = this.userFactory.getRepository(role);

    const user = await userRepository.findOne({ where: { email } });
    if (!user) throw new NotFoundException('User not found');

    const otpCodeHash = generateOtpCodeHash(otpCode);
    if (otpCodeHash !== user.otpCodeHash) {
      throw new BadRequestException('Invalid OTP');
    }

    if (new Date() > user.otpCodeExpiry) {
      throw new BadRequestException('OTP has expired');
    }

    await userRepository.update(
      { email },
      {
        isEmailVerified: true,
        otpCodeHash: null,
        otpCodeExpiry: null,
      },
    );

    return {
      status: true,
      message: 'Email verified successfully',
      data: {},
    };
  }

  async resendEmailVerificationToken(
    dto: ResendEmailVerificationTokenDto,
  ): Promise<IApiResponse> {
    const { email, role } = dto;

    const userRepository = this.userFactory.getRepository(role);

    const user = await userRepository.findOne({ where: { email } });
    if (!user) throw new NotFoundException('User not found');

    if (user.isEmailVerified) {
      throw new BadRequestException('Your email has already been verified');
    }

    const { otpCode, otpCodeHash, otpCodeExpiry } = generateOtpDetails();
    await userRepository.update({ email }, { otpCodeHash, otpCodeExpiry });

    // Trigger event to send OTP verification email
    this.sendEmailVerificationOTP(user.firstName, user.email, otpCode);

    return {
      status: true,
      message: 'Email verification token sent successfully',
      data: {
        email: user.email,
      },
    };
  }

  async login(dto: LoginDto) {
    const { email, password, role } = dto;

    const userRepository = this.userFactory.getRepository(role);

    const user = await userRepository.findOne({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isValidPassword = await verifyPassword(password, user.password);
    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.generateJwtTokens({
      id: user.id,
      role: user.role,
    });

    const signedUrls =
      await this.userService.generateSignedUrlsForUserFiles(user);

    return {
      ...user,
      ...signedUrls,
      tokens,
    };
  }

  async refreshUserToken(authenticatedUser: IDecodedJwtToken) {
    const userRepository = this.userFactory.getRepository(
      authenticatedUser.role,
    );

    const user = await userRepository.findOne({
      where: { id: authenticatedUser.id },
    });

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
    const { email, role } = dto;

    const userRepository = this.userFactory.getRepository(role);

    const user = await userRepository.findOne({ where: { email } });
    if (!user) throw new NotFoundException('User not found');

    const { otpCode, otpCodeHash, otpCodeExpiry } = generateOtpDetails();
    await userRepository.update({ email }, { otpCodeHash, otpCodeExpiry });

    this.eventPublisherService.publishSendEmail({
      to: user.email,
      subject: 'Reset Your Password',
      template: EMAIL_TEMPLATE.PASSWORD_RESET_OTP,
      templateData: { name: user.firstName, otp: otpCode },
    });

    return {
      status: true,
      message: 'Password reset token sent successfully',
      data: {
        email: user.email,
      },
    };
  }

  async validateOtp(dto: ValidateOtpDto): Promise<IApiResponse> {
    const { email, otpCode, role } = dto;

    const userRepository = this.userFactory.getRepository(role);

    const user = await userRepository.findOne({ where: { email } });
    if (!user) throw new NotFoundException('User not found');

    const otpCodeHash = generateOtpCodeHash(otpCode);
    if (otpCodeHash !== user.otpCodeHash) {
      throw new BadRequestException('Invalid OTP');
    }

    if (new Date() > user.otpCodeExpiry) {
      throw new BadRequestException('OTP has expired');
    }

    return {
      status: true,
      message: 'OTP validated successfully',
      data: {},
    };
  }

  async resetPassword(dto: ResetPasswordDto): Promise<IApiResponse> {
    const { email, otpCode, password, role } = dto;

    const userRepository = this.userFactory.getRepository(role);

    const user = await userRepository.findOne({ where: { email } });
    if (!user) throw new NotFoundException('User not found');

    const otpCodeHash = generateOtpCodeHash(otpCode);
    if (otpCodeHash !== user.otpCodeHash) {
      throw new BadRequestException('Invalid OTP');
    }

    if (new Date() > user.otpCodeExpiry) {
      throw new BadRequestException('OTP has expired');
    }

    const hashedPassword = await hashPassword(password);
    await userRepository.update(
      { email },
      {
        password: hashedPassword,
        passwordChangedAt: new Date(),
        otpCodeHash: null,
        otpCodeExpiry: null,
      },
    );

    return {
      status: true,
      message: 'Password reset successfully',
      data: {},
    };
  }

  private async generateJwtTokens(
    payload: IDecodedJwtToken,
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
    this.eventPublisherService.publishSendEmail({
      to: email,
      subject: 'Verify Your Account',
      template: EMAIL_TEMPLATE.EMAIL_VERIFICATION_OTP,
      templateData: { name, otp },
    });
  }
}
