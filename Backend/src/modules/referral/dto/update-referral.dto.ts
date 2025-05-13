import { IsString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateReferralDto {
  @ApiProperty({ description: 'Unique referral code', required: false })
  @IsString()
  @IsOptional()
  code?: string;

  @ApiProperty({ description: 'ID of the user who owns the referral', required: false })
  @IsUUID()
  @IsOptional()
  owner?: string;

  @ApiProperty({ description: 'ID of the user who referred this user', required: false })
  @IsUUID()
  @IsOptional()
  referrer?: string;
} 