import { IsString, IsNotEmpty, IsOptional, IsEmail, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateContactUsDto {
  @ApiProperty({ description: 'User ID who submitted the contact form' })
  @IsUUID()
  @IsNotEmpty()
  user: string;

  @ApiProperty({ description: 'Name of the contact person' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Email address of the contact person' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Phone number of the contact person', required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ description: 'Subject of the contact message' })
  @IsString()
  @IsNotEmpty()
  subject: string;

  @ApiProperty({ description: 'Message content' })
  @IsString()
  @IsNotEmpty()
  message: string;

  @IsString()
  @IsOptional()
  response?: string;

} 