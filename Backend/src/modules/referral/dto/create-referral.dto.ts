import { IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReferralDto {
  @ApiProperty({ required: false, description: 'ID of the referrer' })
  @IsUUID()
  @IsOptional()
  referrerId?: string;

  @ApiProperty({ required: true, description: 'ID of the owner' })
  @IsUUID()
  ownerId: string;
} 