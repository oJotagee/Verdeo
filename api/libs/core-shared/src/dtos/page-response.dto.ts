import { ApiProperty } from '@nestjs/swagger';

export class PageResponseDto<T> {
  @ApiProperty({ description: 'Lista de itens da página atual' })
  data: T[];

  @ApiProperty({ description: 'Número da página atual (base 0)' })
  page: number;

  @ApiProperty({ description: 'Quantidade de itens por página' })
  size: number;

  @ApiProperty({ description: 'Total de itens disponíveis' })
  total: number;

  @ApiProperty({ description: 'Total de páginas disponíveis' })
  totalPages: number;

  private constructor(data: T[], total: number, page: number, size: number) {
    this.data = data;
    this.total = total;
    this.page = page;
    this.size = size;
    this.totalPages = size > 0 ? Math.ceil(total / size) : 0;
  }

  static of<T>(data: T[], total: number, page: number, size: number): PageResponseDto<T> {
    return new PageResponseDto(data, total, page, size);
  }
}
