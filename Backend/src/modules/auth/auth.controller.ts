import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CookieOptions, Request, Response } from 'express';
import { TransformResponse } from '../../core/interceptors';
import { ExcludedUserPropsDto } from '../user/dto';
import { IApiResponse } from './../../core/types/index';
import { AuthService } from './auth.service';
import {
  LoginDto,
  ResendVerificationTokenDto,
  ResetPasswordDto,
  SendCodeDto,
  SendPasswordResetTokenDto,
  SendVerificationCodeDto,
  SignupUserDto,
  ValidateOtpDto,
  VerifyAccountDto,
  VerifyEmailDto,
} from './dto';
import { JwtAccessTokenGuard, JwtRefreshTokenGuard } from './guards';
import { IJwtTokens } from './types';
import { AuthenticatedUser } from '../../core/decorators';
import { IDecodedJwtToken } from './strategies';
import { VerificationMethod } from './dto';
import { JwtAuthGuard } from 'src/core/auth/guards/jwt-auth.guard';
import { OtpAuthGuard } from 'src/core/auth/guards/otp.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/sign-up')
  @TransformResponse(ExcludedUserPropsDto)
  async signupUser(@Body() dto: SignupUserDto): Promise<IApiResponse> {
    return this.authService.signupUser(dto);
  }

  @Post('/verify-email')
  @HttpCode(HttpStatus.OK)
  verifyEmail(@Body() dto: VerifyEmailDto): Promise<IApiResponse> {
    return this.authService.verifyAccount({
      email: dto.email,
      otpCode: dto.otpCode,
      method: VerificationMethod.EMAIL,
    });
  }

  @Post('/resend-email-verification-token')
  @HttpCode(HttpStatus.OK)
  resendEmailVerificationToken(
    @Body() dto: ResendVerificationTokenDto,
  ): Promise<IApiResponse> {
    return this.authService.resendVerificationToken({
      ...dto,
      method: VerificationMethod.EMAIL,
    });
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  @TransformResponse(ExcludedUserPropsDto)
  async login(
    @Body() dto: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<IApiResponse> {
    const data = await this.authService.login(dto);

    // Set cookies
    this.setCookies(req, res, data.tokens);

    return {
      status: true,
      message: 'Login successful',
      data,
    };
  }

  @UseGuards(JwtRefreshTokenGuard)
  @Post('/refresh-user-token')
  @HttpCode(HttpStatus.OK)
  async refreshUserToken(
    @AuthenticatedUser() authenticatedUser: IDecodedJwtToken,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<IApiResponse> {
    const data = await this.authService.refreshUserToken(authenticatedUser);

    // Set cookies
    this.setCookies(req, res, data.tokens);

    return {
      status: true,
      message: 'Token refreshed successfully',
      data,
    };
  }

  @UseGuards(JwtAccessTokenGuard)
  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<IApiResponse> {
    // Clear cookies
    this.clearCookies(req, res);

    return {
      status: true,
      message: 'Logged out successfully',
      data: {},
    };
  }

  @Post('/forgot-password')
  @HttpCode(HttpStatus.OK)
  sendPasswordResetToken(
    @Body() dto: SendPasswordResetTokenDto,
  ): Promise<IApiResponse> {
    return this.authService.sendPasswordResetToken(dto);
  }

  @Post('/validate-otp')
  @HttpCode(HttpStatus.OK)
  validateOtp(@Body() dto: ValidateOtpDto): Promise<IApiResponse> {
    return this.authService.validateOtp(dto);
  }

  @Post('/reset-password')
  @UseGuards(OtpAuthGuard)
  @HttpCode(HttpStatus.OK)
  resetPassword(@Body() dto: ResetPasswordDto): Promise<IApiResponse> {
    return this.authService.resetPassword(dto);
  }

  @Post('/resend-verification-token')
  @HttpCode(HttpStatus.OK)
  resendVerificationToken(
    @Body() dto: ResendVerificationTokenDto,
  ): Promise<IApiResponse> {
    return this.authService.resendVerificationToken(dto);
  }

  @Post('/send-verification-code')
  @HttpCode(HttpStatus.OK)
  sendVerificationCode(
    @Body() dto: SendVerificationCodeDto,
  ): Promise<IApiResponse> {
    return this.authService.sendVerificationCode(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/send-code')
  @HttpCode(HttpStatus.OK)
  sendCode(
    @AuthenticatedUser() authenticatedUser: IDecodedJwtToken,
    @Body() dto: SendCodeDto,
  ): Promise<IApiResponse> {
    return this.authService.sendCode(authenticatedUser.id, dto);
  }

  @Post('/verify-account')
  @UseGuards(OtpAuthGuard)
  @HttpCode(HttpStatus.OK)
  verifyAccount(
    @Body() dto: VerifyAccountDto,
  ): Promise<IApiResponse> {
    return this.authService.verifyAccount(dto);
  }

  private setCookieOptions(req: Request): CookieOptions {
    return {
      httpOnly: true,
      secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
      sameSite: 'none',
    };
  }

  private setCookies(req: Request, res: Response, tokens: IJwtTokens) {
    const cookieOptions = this.setCookieOptions(req);
    res.cookie('accessToken', tokens.accessToken, cookieOptions);
    res.cookie('refreshToken', tokens.refreshToken, cookieOptions);
  }

  private clearCookies(req: Request, res: Response) {
    const cookieOptions = this.setCookieOptions(req);
    res.clearCookie('accessToken', cookieOptions);
    res.clearCookie('refreshToken', cookieOptions);
  }
}
