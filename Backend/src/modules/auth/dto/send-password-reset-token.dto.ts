import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class SendPasswordResetTokenDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase().trim())
  email: string;
}
