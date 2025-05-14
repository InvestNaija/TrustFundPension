import { IsString, IsNotEmpty, IsOptional, IsNumber, IsEnum, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UPLOAD_TYPE } from 'src/core/constants';

export class CreateMediaDto {
  @IsUUID()
  @IsOptional()
  user?: string;

  @ApiProperty({ description: 'Title of the media', required: false })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ description: 'Type of upload', enum: UPLOAD_TYPE })
  @IsEnum(UPLOAD_TYPE)
  @IsNotEmpty()
  upload_type: UPLOAD_TYPE;

  @ApiProperty({ description: 'URL of the uploaded file' })
  @IsString()
  @IsOptional()
  file_url: string;

  @ApiProperty({ description: 'Type of the file (e.g., image/jpeg, video/mp4)' })
  @IsString()
  @IsOptional()
  file_type?: string;

  @ApiProperty({ description: 'Size of the file in bytes', required: false })
  @IsNumber()
  @IsOptional()
  file_size?: number;

  @ApiProperty({ description: 'Tags associated with the media', required: false })
  @IsString()
  @IsOptional()
  tags?: string;
} 