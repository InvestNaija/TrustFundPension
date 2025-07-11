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
import { ReferralService } from '../referral/services';
import { UserRoleRepository } from '../user/repositories/user-role.repository';
import { UserRole } from '../user/entities';
import { NotificationService } from '../notification/services/notification.service';

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);

  constructor(
    private readonly userService: UserService,
    private readonly userRoleRepository: UserRoleRepository,
    private readonly jwtService: JwtService,
    private readonly trustFundService: TrustFundService,
    private readonly referralService: ReferralService,
    private readonly notificationService: NotificationService,
  ) {}

  async signupUser(dto: SignupUserDto): Promise<IApiResponse> {
    let existingUser;
    let existingPhone;

    if (dto.email) {
      existingUser = await this.userService.findByEmail(dto.email);
    }

    if (dto.phone) {
      existingPhone = await this.userService.findByPhone(dto.phone);
    }

    if (existingUser) {
      if (!existingUser.password) {
        throw new UnprocessableEntityException(
          'This email address already exists. Please update your password to continue.',
        );
      }
      
      throw new ConflictException(
        'A user with this email address or phone number already exists.',
      );
    }

    if (existingPhone) {
      throw new ConflictException(
        'A user with this email address or phone number already exists.',
      );
    }

    let hashedPassword: string | undefined;  
    if (dto.password) {
      hashedPassword = await hashPassword(dto.password);
      if (!hashedPassword) {
        throw new BadRequestException('Failed to hash password');
      }
    } else {
      hashedPassword = undefined;
    }

    // Validate referral code if provided
    let referrerId: string | undefined;
    if (dto.referralCode) {
      try {
        const referral = await this.referralService.validateAndFindReferralCode(dto.referralCode);
        referrerId = referral.owner.id;
      } catch (error) {
        throw new BadRequestException('Invalid referral code');
      }
    }

    const { referralCode, ...userData } = dto;
    const user = await this.userService.create({
      ...userData,
      password: hashedPassword || '',
      account_type: dto.accountType || undefined,
    });

    // Assign CLIENT role to the user
    const userRole = new UserRole();
    userRole.userId = user.id;
    userRole.roleId = '403e5c43-a8e1-42c4-b018-87260ce8ac1f'; // CLIENT role ID
    await this.userRoleRepository.save(userRole);

    // Generate referral code for the new user
    const referralResponse = await this.referralService.generateAndCreateReferral(user.id);

    // If user was referred, update the referral with the referrer
    if (referrerId) {
      await this.referralService.update(referralResponse.data.id, {
        referrer: referrerId
      }, user.id);
    }

    return {
      status: true,
      message: 'Registration successful! Please verify your account',
      data: {
        ...user,
        referralCode: referralResponse.data.code
      },
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
        body: `Hello ${user.firstName}, your verification code is: ${otpCode}. Please use this code to verify your account.`,
      });
    } else {
      this.sendSmsVerificationOTP({
        msisdn: user.phone,
        msg: `Hello ${user.firstName}, your verification code is: ${otpCode}. Please use this code to verify your account.`,
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
      const phone = dto.phone.slice(-10)
      user = await this.userService.findByPhone(phone);
    }

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValidPassword = await verifyPassword(dto.password, user.password);
    if (!isValidPassword) {
      await this.sendFailedLoginNotification(user);
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isEmailVerified && !user.isPhoneVerified) {
      throw new BadRequestException('Please verify your account');
    }

    if (dto.fcmToken) {
      await this.userService.update(user.id, { fcmToken: dto.fcmToken });
      await this.notificationService.registerFcmTokenToChannel(dto.fcmToken);
    }

    const tokens = await this.generateJwtTokens({
      id: user.id,
      userRoles: user.userRoles,
    });

    const signedUrls = await this.userService.generateSignedUrlsForUserFiles(user);

    const now = new Date();
    const formattedDate = now.toLocaleDateString();
    const formattedTime = now.toLocaleTimeString();

    await this.trustFundService.sendEmail({
      to: user.email,
      subject: 'Trustfund Login Notification',
      body: `
        <h2>Hello ${user.firstName},</h2>
        <p>You successfully logged into your Trustfund Mobile app on ${formattedDate} at ${formattedTime}.</p>
        <p>If you did not initiate this session, please contact our Support Team immediately on ${envConfig.SUPPORT_PHONE} or send an email to ${envConfig.SUPPORT_EMAIL}</p>
        <p><strong>Please note:</strong> Never share your password with anyone. Create passwords that are hard to guess and don't include personal information in your password.</p>
        <p>Thank you for choosing Trustfund Pensions</p>
        <p><em><strong>This is an automated message, please do not reply directly to the email.</strong></em></p>
      `,
    }).catch((error) => {
      this.logger.error(`Failed to send welcome email: ${error.message}`);
    });

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
        subject: 'Password reset',
        body: `
          <h2>Hello ${user.firstName}</h2>
          <p>Below is your one-time passcode below to reset your password.</p>
          <h1 style="font-size: 24px; font-weight: bold; text-align: center; padding: 10px; background-color: #f5f5f5; border-radius: 5px;">${otpCode}</h1>
          <p>If you did not make this request, please contact our Support Team on ${envConfig.SUPPORT_PHONE} or send an email to ${envConfig.SUPPORT_EMAIL} right away.</p>
          <p><em>This is an automated message; please do not reply directly to this email.</em></p>
        `,
      });
    } else {
      this.sendSmsVerificationOTP({
        msisdn: user.phone,
        msg: `Hello ${user.firstName}, your password reset code is: ${otpCode}. Please use this code to reset your password.`,
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
    let foundByEmail = false;
    let foundByPhone = false;
    
    if (email) {
      user = await this.userService.findByEmail(email);
      foundByEmail = !!user;
    } else if (phone) {
      user = await this.userService.findByPhone(phone);
      foundByPhone = !!user;
    }

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Hash new password
    const hashedPassword = await hashPassword(password);

    // Update user password and verification status
    await this.userService.update(user.id, {
      isEmailVerified: foundByEmail ? true : user.isEmailVerified,
      isPhoneVerified: foundByPhone ? true : user.isPhoneVerified,
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
        subject: 'Verify your email',
        body: `
          <h2>Hi ${user.firstName},</h2>
          <p>Thank you for registering on the Trustfund Mobile Application.</p>
          <p>Use the code below to complete your registration</p>
          <h1 style="font-size: 24px; font-weight: bold; text-align: center; padding: 10px; background-color: #f5f5f5; border-radius: 5px;">${otpCode}</h1>
          <p>Thank you.</p>
        `,
      });
    } else {
      this.sendSmsVerificationOTP({
        msisdn: user.phone,
        msg: `Your verification code is: ${otpCode}. Please do not share your code with anyone.`,
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

    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    let message: string;
    if (dto.context === 'bvn') {
      if (dto.method === VerificationMethod.EMAIL) {
        message = `
          <h2>Hi ${user.firstName},</h2>
          <p>Your BVN validation code is <strong>${otpCode}</strong></p>
          <p>Please enter the code in your Trustfund mobile app to complete your registration process.</p>
          <p>This token confirms that the BVN you submitted is yours.</p>
          <p>Please do not share your token with anyone.</p>
          <p>If you did not initiate this request, please contact our Support Team on ${envConfig.SUPPORT_PHONE} or send an email to ${envConfig.SUPPORT_EMAIL}.</p>
        `;
      } else {
        message = `Your BVN verification code is: ${otpCode}`;
      }
    } else if (dto.context === 'nin') {
      if (dto.method === VerificationMethod.EMAIL) {
        message = `
          <h2>Hi ${user.firstName},</h2>
          <p>Your NIN verification code is <strong>${otpCode}</strong></p>
          <p>Please enter the code in your Trustfund mobile app to complete your registration process.</p>
          <p>This token confirms that the NIN you submitted is yours.</p>
          <p>Please do not share your token with anyone.</p>
          <p>If you did not initiate this request, please contact our Support Team on ${envConfig.SUPPORT_PHONE} or send an email to ${envConfig.SUPPORT_EMAIL}.</p>
        `;
      } else {
        message = `Your NIN verification code is: ${otpCode}`;
      }
    } else {
      message = `Your verification code is: ${otpCode}`;
    }
    
    if (dto.method === VerificationMethod.EMAIL) {
      if (!dto.email) throw new BadRequestException('Email is required');
      await this.trustFundService.sendEmail({
        to: dto.email,
        subject: `${dto.context.toUpperCase()} Validation Token`,
        body: message
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

  async changePassword(userId: string, dto: { oldPassword: string; newPassword: string }): Promise<IApiResponse> {
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (!user.password) {
      throw new BadRequestException('Password not set for this user');
    }

    const isMatch = await verifyPassword(dto.oldPassword, user.password);
    if (!isMatch) {
      throw new BadRequestException('Old password is incorrect');
    }

    if (dto.oldPassword === dto.newPassword) {
      throw new BadRequestException('New password cannot be the same as the old password');
    }
    
    const hashed = await hashPassword(dto.newPassword);
    if (!hashed) {
      throw new BadRequestException('Failed to hash password');
    }
    await this.userService.updatePassword(userId, {
      password: hashed,
      passwordChangedAt: new Date(),
      otpCodeHash: null,
      otpCodeExpiry: null
    });

    return {
      status: true,
      message: 'Password changed successfully',
      data: {},
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

  private async sendFailedLoginNotification(user: any): Promise<void> {
    const now = new Date();
    const formattedDate = now.toLocaleDateString();
    const formattedTime = now.toLocaleTimeString();

    await this.trustFundService.sendEmail({
      to: user.email,
      subject: 'Login Unsuccessful',
      body: `
        <h2>Hello ${user.firstName},</h2>
        <p>Your login attempt on ${formattedTime} at ${formattedDate} was unsuccessful.</p>
        <p>If you did not initiate this session, please contact our Support Team on ${envConfig.SUPPORT_PHONE} or send an email to ${envConfig.SUPPORT_EMAIL} immediately.</p>
        <p><strong>Please note:</strong> Never share your password with anyone. Create passwords that are hard to guess and don't include personal information in your password.</p>
        <p>Thank you for choosing Trustfund Pension</p>
        <p><em><strong>This is an automated message, please do not reply directly to the email.</strong></em></p>
      `,
    }).catch((error) => {
      this.logger.error(`Failed to send failed login notification: ${error.message}`);
    });
  }
}
