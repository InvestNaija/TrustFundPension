import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class BvnDataResponseDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  userId: string;

  @ApiProperty()
  @Expose()
  bvn: string;

  @ApiProperty()
  @Expose()
  bvnResponse: any;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;

  @ApiProperty()
  @Expose()
  deletedAt: Date;
} 