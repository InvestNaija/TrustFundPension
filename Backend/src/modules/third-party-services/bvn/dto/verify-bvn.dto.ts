import { IsString, IsNotEmpty, Length } from 'class-validator';

export class VerifyBvnDto {
  @IsString()
  @IsNotEmpty()
  @Length(11, 11, { message: 'BVN must be exactly 11 digits' })
  bvn: string;
} 