import { IsString, IsNotEmpty, IsDateString, IsBoolean, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class GenerateReportQueryDto {
  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  fromDate: string;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  toDate: string;

  @ApiProperty()
  @Transform(({ value }) => {
    if (value === 'true' || value === '1' || value === true) return true;
    if (value === 'false' || value === '0' || value === false) return false;
    return value;
  })
  @IsBoolean()
  @IsOptional()
  sendToEmail?: boolean;
} 