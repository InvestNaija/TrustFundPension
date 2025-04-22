import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty()
  id: number;

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

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @Exclude()
  password: string;

  @Exclude()
  deletedAt: Date;
} 