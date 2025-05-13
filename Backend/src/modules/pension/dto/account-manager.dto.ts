import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AccountManagerRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  rsa_number: string;
} 