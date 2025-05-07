import { IsString, IsNotEmpty, Length } from 'class-validator';

export class GetBvnDetailsDto {
  @IsString()
  @IsNotEmpty()
  @Length(11, 11, { message: 'BVN must be exactly 11 digits' })
  bvn: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;
} 