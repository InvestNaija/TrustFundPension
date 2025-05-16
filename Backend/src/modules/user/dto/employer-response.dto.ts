import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class AddressResponseDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  houseNumber: string;

  @ApiProperty()
  @Expose()
  streetName: string;

  @ApiProperty()
  @Expose()
  city: string;

  @ApiProperty()
  @Expose()
  state: string;

  @ApiProperty()
  @Expose()
  lgaCode: string;

  @ApiProperty()
  @Expose()
  zipCode: string;

  @ApiProperty()
  @Expose()
  countryCode: string;

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

  @ApiProperty({ type: [AddressResponseDto] })
  @Expose()
  @Type(() => AddressResponseDto)
  addresses: AddressResponseDto[];

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