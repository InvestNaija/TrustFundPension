import { IsString, IsNotEmpty, IsNumber, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBvnDataDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  user_id: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  bvn: string;

  @ApiProperty()
  @IsObject()
  @IsNotEmpty()
  bvn_response: any;
} 