import { ApiProperty } from '@nestjs/swagger';

export class BvnDataResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  user_id: number;

  @ApiProperty()
  bvn: string;

  @ApiProperty()
  bvn_response: any;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  deletedAt: Date;
} 