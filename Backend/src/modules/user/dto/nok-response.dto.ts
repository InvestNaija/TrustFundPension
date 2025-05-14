import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Address } from '../entities/address.entity';

export class NokResponseDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  userId: string;

  @ApiProperty()
  @Expose()
  title: string;

  @ApiProperty()
  @Expose()
  firstName: string;

  @ApiProperty({ required: false })
  @Expose()
  middleName?: string;

  @ApiProperty()
  @Expose()
  lastName: string;

  @ApiProperty()
  @Expose()
  gender: string;

  @ApiProperty()
  @Expose()
  phone: string;

  @ApiProperty({ required: false })
  @Expose()
  email?: string;

  @ApiProperty()
  @Expose()
  relationship: string;

  @ApiProperty()
  @Expose()
  address: Address;

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