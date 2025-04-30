import { IsString, IsEmail, IsNotEmpty, IsBoolean, IsOptional, IsDate, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { USER_ROLE, ACCOUNT_TYPE } from '../../../core/constants';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  bvn: string;
  
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nin: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  rsa_pin: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  first_name: string;
  
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  middle_name: string;
  
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  last_name: string;
  
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

  @ApiProperty({ enum: USER_ROLE })
  @IsEnum(USER_ROLE)
  @IsNotEmpty()
  role: USER_ROLE;

  @ApiProperty({ enum: ACCOUNT_TYPE })
  @IsEnum(ACCOUNT_TYPE)
  @IsNotEmpty()
  account_type: ACCOUNT_TYPE;

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
  is_enabled?: boolean;

  @ApiProperty({ default: false })
  @IsBoolean()
  @IsOptional()
  is_locked?: boolean;

  @ApiProperty({ default: true })
  @IsBoolean()
  @IsOptional()
  first_login?: boolean;
  
  @ApiProperty({ default: false })
  @IsBoolean()
  @IsOptional()
  two_factor_auth?: boolean;
} 