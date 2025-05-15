import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { VerificationMethod } from './verification-preference.dto';

export class SendVerificationCodeDto {
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

export class SendCodeDto {
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

  @ApiProperty({ enum: ['bvn', 'nin'] })
  @IsString()
  @IsNotEmpty()
  context: 'bvn' | 'nin';
} 