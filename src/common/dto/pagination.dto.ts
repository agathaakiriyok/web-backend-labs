import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class PaginationDto {
  @ApiPropertyOptional({ description: 'Номер страницы (начиная с 1)', default: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Количество элементов на странице', default: 10, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;
}

export function buildLinkHeader(
  req: { protocol: string; hostname: string; path: string },
  page: number,
  limit: number,
  total: number,
  port?: number,
): string {
  const totalPages = Math.ceil(total / limit);
  const base = `${req.protocol}://${req.hostname}${port && port !== 80 && port !== 443 ? `:${port}` : ''}${req.path}`;
  const links: string[] = [];

  if (page > 1) {
    links.push(`<${base}?page=${page - 1}&limit=${limit}>; rel="prev"`);
  }
  if (page < totalPages) {
    links.push(`<${base}?page=${page + 1}&limit=${limit}>; rel="next"`);
  }
  links.push(`<${base}?page=1&limit=${limit}>; rel="first"`);
  links.push(`<${base}?page=${totalPages}&limit=${limit}>; rel="last"`);

  return links.join(', ');
}
