import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
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
}
