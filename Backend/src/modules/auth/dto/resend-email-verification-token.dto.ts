import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { USER_ROLE } from '../../../core/constants';
import { Transform } from 'class-transformer';

export class ResendEmailVerificationTokenDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase().trim())
  email: string;

  // @IsString()
  // @IsNotEmpty()
  // @IsEnum(USER_ROLE)
  // role: USER_ROLE;
}
