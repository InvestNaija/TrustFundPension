import { IsBoolean, IsOptional, IsNumber } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class EmbassyLetterQueryDto {
  @ApiProperty({ required: true, description: 'Embassy ID' })
  @Type(() => Number)
  @IsNumber()
  embassyId: number;

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