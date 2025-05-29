export class PageMetaDto {
  itemCount: number;
  total: number;
  page: number;
  limit: number;
  pageCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;

  constructor(itemCount: number, total: number, page: number, limit: number) {
    this.itemCount = itemCount;
    this.total = total;
    this.page = page;
    this.limit = limit;
    this.pageCount = Math.ceil(total / limit);
    this.hasPreviousPage = page > 1;
    this.hasNextPage = page < this.pageCount;
  }
} 