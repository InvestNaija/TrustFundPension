import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SmsRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  msisdn: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  msg: string;
} 