import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { USER_ROLE } from '../../../core/constants';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { VerificationMethod } from './verification-preference.dto';

export class ResendVerificationTokenDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail()
  @Transform(({ value }) => value?.toLowerCase().trim())
  email?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ enum: VerificationMethod })
  @IsEnum(VerificationMethod)
  @IsNotEmpty()
  method: VerificationMethod;
}
