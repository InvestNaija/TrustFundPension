import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyNinDto {
  @ApiProperty({
    description: 'National Identification Number',
    example: '12345678901'
  })
  @IsString()
  @IsNotEmpty()
  nin: string;

  @ApiProperty({
    description: 'One-time password (OTP) code',
    example: '123456'
  })
  @IsString()
  @IsNotEmpty()
  otpCode: string;
} 