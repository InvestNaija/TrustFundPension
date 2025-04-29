import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum VerificationMethod {
  EMAIL = 'email',
  SMS = 'sms',
}

export class VerificationPreferenceDto {
  @ApiProperty({ enum: VerificationMethod })
  @IsEnum(VerificationMethod)
  @IsNotEmpty()
  method: VerificationMethod;
} 