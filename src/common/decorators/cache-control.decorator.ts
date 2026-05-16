import { Header } from '@nestjs/common';

/**
 * Sets the Cache-Control response header on an endpoint.
 * Example: @CacheControl('public, max-age=3600')
 */
export const CacheControl = (directive: string): MethodDecorator =>
  Header('Cache-Control', directive);
