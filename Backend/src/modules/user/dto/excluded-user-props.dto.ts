import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ExcludedUserPropsDto {
  @Exclude()
  @ApiProperty({ description: 'User password' })
  password: string;

  @Exclude()
  @ApiProperty({ description: 'User deleted at timestamp' })
  deletedAt: Date;
} 