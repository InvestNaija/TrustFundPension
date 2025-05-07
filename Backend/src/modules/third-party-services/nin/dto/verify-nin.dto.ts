import { IsString, IsNotEmpty, Length } from 'class-validator';

export class VerifyNinDto {
  @IsString()
  @IsNotEmpty()
  @Length(11, 11, { message: 'NIN must be exactly 11 digits' })
  nin: string;
} 