import { IsString, IsEmail, IsOptional, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  first_name?: string;
  
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  middle_name?: string;
  
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  last_name?: string;
  
  @ApiProperty({ required: false })
  @IsEmail()
  @IsOptional()
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
  state_of_posting?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  lga_of_posting?: string;

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
  @IsDate()
  @IsOptional()
  otpCodeExpiry?: Date | null;
} 