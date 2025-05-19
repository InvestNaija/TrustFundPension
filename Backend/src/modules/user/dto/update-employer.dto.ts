import { IsString, IsNumber, IsDateString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateEmployerDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  userId?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  rcNumber?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  phoneNumber?: string;


  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  initialDate?: string;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  currentDate?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  natureOfBusiness?: string;

} 