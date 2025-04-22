import { IsString, IsEmail, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
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
  rsa_pin?: string;

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
  password?: string;

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
  referrer?: string;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  show_balance?: boolean;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  is_enabled?: boolean;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  is_locked?: boolean;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  first_login?: boolean;
  
  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  two_factor_auth?: boolean;
} 