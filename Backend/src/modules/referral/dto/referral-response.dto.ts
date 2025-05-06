import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../user/entities/user.entity';

export class ReferralResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  code: string;

  @ApiProperty({ type: () => User })
  owner: User;

  @ApiProperty({ type: () => User, required: false })
  referrer?: User;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
} 