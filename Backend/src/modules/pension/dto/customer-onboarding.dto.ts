import { IsString, IsEmail, IsNotEmpty, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CustomerOnboardingRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  formRefno: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  schemeId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  ssn: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  gender: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  firstname: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  surname: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  maritalStatusCode: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  placeOfBirth: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  mobilePhone: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  permanentAddressLocation: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nationalityCode: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  stateOfOrigin: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lgaCode: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  permCountry: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  permState: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  permLga: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  permCity: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  bankName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  accountNumber: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  accountName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  bvn: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  othernames?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  maidenName?: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  permanentAddress: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  permBox?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  permanentAddress1?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  permZip?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  employerType: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  employerRcno: string;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  dateOfFirstApointment: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  employerLocation: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  employerCountry: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  employerStatecode: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  employerLga: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  employerCity: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  employerBusiness: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  employerAddress1: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  employerAddress: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  employerZip?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  employerBox?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  employerPhone: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nokTitle: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nokName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nokSurname: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nokGender: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nokRelationship: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nokLocation: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nokCountry: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nokStatecode: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nokLga: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nokCity: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  nokOthername?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nokAddress1: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nokAddress: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  nokZip?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  nokEmailaddress?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  nokBox?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nokMobilePhone: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  pictureImage?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  formImage?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  signatureImage?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  stateOfPosting: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  agentCode: string;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  dateOfBirth: string;
} 