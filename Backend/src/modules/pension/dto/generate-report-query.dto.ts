import { IsString, IsNotEmpty, IsDateString } from 'class-validator';
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
} 