import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AccountManagerRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  rsaNumber: string;
} 