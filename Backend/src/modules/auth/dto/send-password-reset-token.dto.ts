import { IsEmail, IsNotEmpty, IsString, IsEnum, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { VerificationMethod } from './verification-preference.dto';

export class SendPasswordResetTokenDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail()
  @Transform(({ value }) => value?.toLowerCase().trim())
  email?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ enum: VerificationMethod, default: VerificationMethod.EMAIL })
  @IsEnum(VerificationMethod)
  @IsNotEmpty()
  method: VerificationMethod;
}
