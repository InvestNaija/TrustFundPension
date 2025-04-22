import { IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserRoleDto {
  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  user_id?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  role_id?: number;
} 