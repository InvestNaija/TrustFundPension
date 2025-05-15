import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyBvnDto {
  @ApiProperty({
    description: 'Bank Verification Number',
    example: '12345678901'
  })
  @IsString()
  @IsNotEmpty()
  bvn: string;

  @ApiProperty({
    description: 'One-time password (OTP) code',
    example: '123456'
  })
  @IsString()
  @IsNotEmpty()
  otpCode: string;
} 