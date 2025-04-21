import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ContributionRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  pin: string;
} 