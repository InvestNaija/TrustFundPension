import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { USER_ROLE } from '../../../core/constants';
import { Transform } from 'class-transformer';

export class ValidateOtpDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase().trim())
  email: string;

  @IsNotEmpty()
  @IsString()
  otpCode: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(USER_ROLE)
  role: USER_ROLE;
}
