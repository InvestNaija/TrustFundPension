import { IsString, IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReferralDto {
  @ApiProperty({ description: 'Unique referral code' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ description: 'ID of the user who owns the referral' })
  @IsUUID()
  @IsNotEmpty()
  owner: string;

  @ApiProperty({ description: 'ID of the user who referred this user', required: false })
  @IsUUID()
  @IsNotEmpty()
  referrer: string;
} 