import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';
import { Transform } from 'class-transformer';

export class LoginDto {
  @IsOptional()
  @IsString()
  @IsEmail()
  @Transform(({ value }) => value?.toLowerCase().trim())
  email?: string;

  @IsOptional()
  @IsString()
  // @Matches(/^\d{10}$/, { message: 'RSA PIN must be 10 digits' })
  rsaPin?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\+?[1-9]\d{10,14}$/, { message: 'Phone number must be valid' })
  phone?: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  validateLoginMethod(): void {
    const methods = [this.email, this.rsaPin, this.phone].filter(Boolean);
    if (methods.length !== 1) {
      throw new Error('Exactly one login method (email, RSA PIN, or phone) must be provided');
    }
  }
}
