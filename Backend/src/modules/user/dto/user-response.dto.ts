import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ACCOUNT_TYPE, USER_ROLE } from '../../../core/constants';

export class UserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  bvn: string;
  
  @ApiProperty()
  nin: string;

  @ApiProperty()
  rsa_pin: string;

  @ApiProperty()
  first_name: string;
  
  @ApiProperty()
  middle_name: string;
  
  @ApiProperty()
  last_name: string;
  
  @ApiProperty()
  email: string;
  
  @ApiProperty()
  dob: string;
  
  @ApiProperty()
  gender: string;
  
  @ApiProperty()
  phone: string;

  @ApiProperty()
  uuid_token: string;

  @ApiProperty()
  ref_code: string;

  @ApiProperty()
  referrer: string;

  @ApiProperty()
  show_balance: boolean;

  @ApiProperty()
  state_of_posting: string;

  @ApiProperty()
  lga_of_posting: string;

  @ApiProperty()
  is_enabled: boolean;

  @ApiProperty()
  is_locked: boolean;

  @ApiProperty()
  first_login: boolean;
  
  @ApiProperty()
  two_factor_auth: boolean;

  @ApiProperty({ enum: USER_ROLE })
  role: USER_ROLE;

  @ApiProperty({ enum: ACCOUNT_TYPE })
  account_type: ACCOUNT_TYPE;

  @ApiProperty()
  otpCodeHash: string | null;

  @ApiProperty()
  otpCodeExpiry: Date | null;

  @ApiProperty()
  isEmailVerified: boolean;

  @ApiProperty()
  isPhoneVerified: boolean;

  @ApiProperty()
  passwordChangedAt: Date | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @Exclude()
  password: string;

  @ApiProperty()
  deletedAt: Date | null;
} 