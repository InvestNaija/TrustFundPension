import { ApiProperty } from '@nestjs/swagger';

export class NokResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  user_id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  first_name: string;

  @ApiProperty()
  other_name: string;

  @ApiProperty()
  surname: string;

  @ApiProperty()
  gender: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  deletedAt: Date;
} 