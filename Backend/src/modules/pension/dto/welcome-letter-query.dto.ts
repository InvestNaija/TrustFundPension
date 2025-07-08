import { IsBoolean, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class WelcomeLetterQueryDto {
  @ApiProperty({ required: false, description: 'Send letter to email' })
  @Transform(({ value }) => {
    if (value === 'true' || value === '1' || value === true) return true;
    if (value === 'false' || value === '0' || value === false) return false;
    return value;
  })
  @IsBoolean()
  @IsOptional()
  sendToEmail?: boolean;
} 