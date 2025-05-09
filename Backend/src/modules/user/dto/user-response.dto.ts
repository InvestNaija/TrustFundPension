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
  pen: string;

  @ApiProperty({ name: 'first_name' })
  firstName: string;
  
  @ApiProperty({ name: 'middle_name' })
  middleName: string;
  
  @ApiProperty({ name: 'last_name' })
  lastName: string;
  
  @ApiProperty()
  email: string;
  
  @ApiProperty()
  dob: string;
  
  @ApiProperty()
  gender: string;
  
  @ApiProperty()
  phone: string;

  @ApiProperty()
  uuidToken: string;

  @ApiProperty({ name: 'ref_code' })
  refCode: string;

  @ApiProperty()
  referrer: string;

  @ApiProperty({ name: 'show_balance' })
  showBalance: boolean;

  @ApiProperty({ name: 'state_of_posting' })
  stateOfPosting: string;

  @ApiProperty({ name: 'lga_of_posting' })
  lgaOfPosting: string;

  @ApiProperty({ name: 'is_enabled' })
  isEnabled: boolean;

  @ApiProperty({ name: 'is_locked' })
  isLocked: boolean;

  @ApiProperty({ name: 'first_login' })
  firstLogin: boolean;
  
  @ApiProperty({ name: 'two_factor_auth' })
  twoFactorAuth: boolean;

  @ApiProperty({ enum: USER_ROLE, name: 'role' })
  role: USER_ROLE;

  @ApiProperty({ enum: ACCOUNT_TYPE, name: 'account_type' })
  accountType: ACCOUNT_TYPE;

  @ApiProperty({ name: 'otp_code_hash' })
  otpCodeHash: string | null;

  @ApiProperty({ name: 'otp_code_expiry' })
  otpCodeExpiry: Date | null;

  @ApiProperty({ name: 'is_email_verified' })
  isEmailVerified: boolean;

  @ApiProperty({ name: 'is_phone_verified' })
  isPhoneVerified: boolean;

  @ApiProperty({ name: 'password_changed_at' })
  passwordChangedAt: Date | null;

  @ApiProperty({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ name: 'updated_at' })
  updatedAt: Date;

  @Exclude()
  password: string;

  @ApiProperty({ name: 'deleted_at' })
  deletedAt: Date | null;
} 