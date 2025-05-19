import { IsString, IsEmail, IsNotEmpty, IsBoolean, IsOptional, IsDate, IsEnum, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ACCOUNT_TYPE } from '../../../core/constants';

export class CreateUserDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  bvn?: string;
  
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  nin?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  pen?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  firstName: string;
  
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  middleName?: string;
  
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lastName: string;
  
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;
  
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  dob: string;
  
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  gender: string;
  
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  phone: string;
  
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  referrer?: string;

  @ApiProperty({ default: false })
  @IsBoolean()
  @IsOptional()
  show_balance?: boolean;

  @ApiProperty({ enum: ACCOUNT_TYPE, required: false })
  @IsEnum(ACCOUNT_TYPE)
  @IsOptional()
  account_type?: ACCOUNT_TYPE;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  otpCodeHash?: string | null;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDate()
  otpCodeExpiry?: Date | null;

  @ApiProperty({ default: true })
  @IsBoolean()
  @IsOptional()
  isEnabled?: boolean;

  @ApiProperty({ default: false })
  @IsBoolean()
  @IsOptional()
  isLocked?: boolean;

  @ApiProperty({ default: true })
  @IsBoolean()
  @IsOptional()
  firstLogin?: boolean;
  
  @ApiProperty({ default: false })
  @IsBoolean()
  @IsOptional()
  twoFactorAuth?: boolean;

  @ApiProperty({ default: false })
  @IsBoolean()
  @IsOptional()
  isEmailVerified?: boolean;

  @ApiProperty({ default: false })
  @IsBoolean()
  @IsOptional()
  isPhoneVerified?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDate()
  passwordChangedAt?: Date | null;
} 