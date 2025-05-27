import { IsString, IsEmail, IsOptional, IsDate, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  middleName?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  dob?: string;
  
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  gender?: string;
  
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  stateOfPosting?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  lgaOfPosting?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  password?: string;

  @ApiProperty({ required: false })
  @IsDate()
  @IsOptional()
  passwordChangedAt?: Date;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  otpCodeHash?: string | null;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDate()
  otpCodeExpiry?: Date | null;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  isOnboarded?: boolean;

  @ApiProperty({ required: false })
  @IsDate()
  @IsOptional()
  onboardingDate?: Date;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  bvn?: string;
} 