import { ApiProperty } from '@nestjs/swagger';

export class EmployerResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  user_id: number;

  @ApiProperty()
  business: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  rcno: string;

  @ApiProperty()
  first_appoint_date: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  deletedAt: Date;
} 