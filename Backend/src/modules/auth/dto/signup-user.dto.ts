import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
  IsDateString,
  IsOptional,
  IsBoolean,
  IsUUID,
  IsDate,
} from 'class-validator';
import { USER_ROLE, ACCOUNT_TYPE } from '../../../core/constants';
import { ApiProperty } from '@nestjs/swagger';

export class SignupUserDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  bvn?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  nin?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  pen?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  middleName?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase().trim())
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+={}\[\]|\\:;"'<>,.?/~`-])[A-Za-z\d!@#$%^&*()_+={}\[\]|\\:;"'<>,.?/~`-]{8,}$/,
    {
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character',
    },
  )
  password: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  gender: string;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  dob: string;

  @ApiProperty({ enum: ACCOUNT_TYPE, required: false })
  @IsEnum(ACCOUNT_TYPE)
  @IsOptional()
  accountType?: ACCOUNT_TYPE;

  @ApiProperty({ required: false, description: 'Referral code of the user who referred this user' })
  @IsString()
  @IsOptional()
  referralCode?: string;
} 