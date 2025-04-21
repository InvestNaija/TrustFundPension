import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class WelcomeLetterRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  pin: string;
} 