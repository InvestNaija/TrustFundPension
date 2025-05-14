import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Address } from '../entities/address.entity';

export class EmployerResponseDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  userId: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  rcNumber: string;

  @ApiProperty()
  @Expose()
  phoneNumber: string;

  @ApiProperty()
  @Expose()
  initialDate: Date;

  @ApiProperty()
  @Expose()
  currentDate: Date;
  
  @ApiProperty()
  @Expose()
  natureOfBusiness: string;

  @ApiProperty()
  @Expose()
  addresses: Address[];

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