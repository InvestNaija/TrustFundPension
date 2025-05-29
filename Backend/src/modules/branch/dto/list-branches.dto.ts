import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../../core/dto/pagination.dto';

export class ListBranchesDto extends PaginationDto {
  @IsOptional()
  @IsString()
  search?: string;
} 