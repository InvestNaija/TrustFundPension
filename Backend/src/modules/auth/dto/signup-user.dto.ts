import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
  IsDateString,
} from 'class-validator';
import { USER_ROLE } from '../../../core/constants';
import { ApiProperty } from '@nestjs/swagger';

export class SignupUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  bvn: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  nin: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  rsa_pin: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  first_name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  middle_name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  last_name: string;

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

  @ApiProperty({ enum: USER_ROLE })
  @IsNotEmpty()
  @IsEnum(USER_ROLE)
  role: USER_ROLE;
} 