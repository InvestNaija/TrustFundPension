import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFundTransferDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  currentFund: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  aspiringFund: string;
}

export class FundTransferResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  currentFund: string;

  @ApiProperty()
  aspiringFund: string;

  @ApiProperty()
  isApproved: boolean;

  @ApiProperty()
  approvalDate: Date;

  @ApiProperty()
  rejectionReason: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
} 