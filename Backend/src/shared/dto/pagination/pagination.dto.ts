import { Type } from 'class-transformer';
import { IsArray, IsInt, IsOptional, Min } from 'class-validator';
import { PageMetaDto } from './pagination-meta.dto';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 20;

  get skip(): number {
    return (this.page - 1) * this.limit;
  }
}

export class PageDto<T> {
  @IsArray()
  @ApiProperty({ isArray: true })
  readonly data: T[];

  @ApiProperty({ type: () => PageMetaDto })
  readonly meta: PageMetaDto;

  constructor(data: T[], meta: PageMetaDto) {
    this.data = data;
    this.meta = meta;
  }
}
