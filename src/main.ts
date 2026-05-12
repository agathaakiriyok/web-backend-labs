import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import hbs from 'hbs';
import * as dotenv from 'dotenv';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';
import { TimingInterceptor } from './common/interceptors/timing.interceptor';
import { ETagInterceptor } from './common/interceptors/etag.interceptor';
dotenv.config({ path: join(process.cwd(), '.env') });

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(require('express').urlencoded({ extended: true }));

  app.use((_req: any, res: any, next: any) => {
    res.setHeader('Access-Control-Allow-Private-Network', 'true');
    next();
  });

  app.enableCors({
    origin: process.env.ALLOWED_ORIGIN || true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
      'Origin',
    ],
    exposedHeaders: ['X-Elapsed-Time', 'X-Total-Count', 'ETag', 'Link'],
  });

  const root = process.cwd();
  app.useStaticAssets(join(root, 'public'));
  app.setBaseViewsDir(join(root, 'views'));
  app.setViewEngine('hbs');

  hbs.registerPartials(join(root, 'views', 'partials'), { rename: (name) => name });
  hbs.registerHelper('eq', (left: unknown, right: unknown) => left === right);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
    }),
  );

  app.useGlobalFilters(new PrismaExceptionFilter(), new HttpExceptionFilter());

  // TimingInterceptor is outermost — its map runs last (after ETag)
  // ETagInterceptor is inner — it processes raw handler data first
  app.useGlobalInterceptors(new TimingInterceptor(), new ETagInterceptor());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Эрмитаж — REST API')
    .setDescription('RESTful API музея Эрмитаж: управление выставками, залами, заказами и отзывами')
    .setVersion('1.0')
    .addTag('users', 'Пользователи')
    .addTag('halls', 'Залы')
    .addTag('exhibitions', 'Выставки')
    .addTag('orders', 'Заказы (билеты)')
    .addTag('feedback', 'Отзывы')
    .addCookieAuth('session', {
      type: 'apiKey',
      in: 'cookie',
      name: 'session',
      description: 'Firebase session cookie. Войдите через /auth/login чтобы получить cookie.',
    })
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: { persistAuthorization: true, withCredentials: true },
  });

  await app.listen(Number(process.env.PORT) || 3000);
}
bootstrap();
