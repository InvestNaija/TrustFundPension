import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class EmployerResponseDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  userId: string;

  @ApiProperty()
  @Expose()
  business: string;

  @ApiProperty()
  @Expose()
  phone: string;

  @ApiProperty()
  @Expose()
  type: string;

  @ApiProperty()
  @Expose()
  rcno: string;

  @ApiProperty()
  @Expose()
  first_appoint_date: string;

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