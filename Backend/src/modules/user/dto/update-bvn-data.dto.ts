import { IsString, IsNumber, IsObject, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateBvnDataDto {
  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  user_id?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  bvn?: string;

  @ApiProperty({ required: false })
  @IsObject()
  @IsOptional()
  bvn_response?: any;
} 