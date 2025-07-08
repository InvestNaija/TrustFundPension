import { IsString, IsNotEmpty, IsDateString, IsBoolean, IsOptional } from 'class-validator';
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
  @IsBoolean()
  @IsOptional()
  sendToEmail?: boolean;
} 