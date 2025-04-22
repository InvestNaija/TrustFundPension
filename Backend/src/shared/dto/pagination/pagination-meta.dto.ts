import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from './pagination.dto';

interface PageMetaDtoParameters {
  pageOptionsDto: PaginationDto;
  itemCount: number;
  extraInfo?: Record<string, unknown> | undefined;
}

export class PageMetaDto {
  @ApiProperty()
  readonly page: number;

  @ApiProperty()
  readonly limit: number;

  @ApiProperty()
  readonly itemCount: number;

  @ApiProperty()
  readonly pageCount: number;

  @ApiProperty()
  readonly hasPreviousPage: boolean;

  @ApiProperty()
  readonly hasNextPage: boolean;

  @ApiProperty()
  readonly extraInfo?: Record<string, unknown> | undefined;

  constructor({ pageOptionsDto, itemCount, extraInfo }: PageMetaDtoParameters) {
    this.page = pageOptionsDto.page;
    this.limit = pageOptionsDto.limit;
    this.itemCount = itemCount;
    this.pageCount = Math.ceil(this.itemCount / this.limit);
    this.hasPreviousPage = this.page > 1;
    this.hasNextPage = this.page < this.pageCount;
    this.extraInfo = extraInfo;
  }
}
