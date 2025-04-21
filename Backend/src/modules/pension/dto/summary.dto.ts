import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SummaryRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  pin: string;
} 