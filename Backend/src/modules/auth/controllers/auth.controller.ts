import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse, ApiProperty } from '@nestjs/swagger';
import { AuthService } from '../auth.service';
import { SendPasswordResetTokenDto } from '../dto/send-password-reset-token.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { IApiResponse } from '../../../core/types';

class ApiResponseDto {
  @ApiProperty()
  status: boolean;

  @ApiProperty()
  message: string;

  @ApiProperty()
  data: Record<string, any>;
}

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send password reset token' })
  @ApiBody({ type: SendPasswordResetTokenDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Password reset token sent successfully',
    type: ApiResponseDto,
  })
  sendPasswordResetToken(
    @Body() dto: SendPasswordResetTokenDto,
  ): Promise<IApiResponse> {
    return this.authService.sendPasswordResetToken(dto);
  }

  @Post('/reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset user password' })
  @ApiBody({ 
    type: ResetPasswordDto,
    description: 'Password reset credentials'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Password reset successful',
    type: ApiResponseDto
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid or expired token'
  })
  resetPassword(@Body() dto: ResetPasswordDto): Promise<IApiResponse> {
    return this.authService.resetPassword(dto);
  }
} 