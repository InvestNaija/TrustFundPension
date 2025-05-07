import { IsString, IsEmail, IsOptional, IsDate } from 'class-validator';
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
  otpCodeHash?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDate()
  otpCodeExpiry?: Date | null;
} 