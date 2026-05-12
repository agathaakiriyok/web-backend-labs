import { Header } from '@nestjs/common';

export const CacheControl = (directive: string): MethodDecorator =>
  Header('Cache-Control', directive);
