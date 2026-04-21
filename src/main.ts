import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import session from 'express-session';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import hbs from 'hbs';
import * as dotenv from 'dotenv';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';

dotenv.config({ path: join(process.cwd(), '.env') });

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const root = process.cwd();
  app.useStaticAssets(join(root, 'public'));
  app.setBaseViewsDir(join(root, 'views'));
  app.setViewEngine('hbs');

  hbs.registerPartials(join(root, 'views', 'partials'), { rename: (name) => name });
  hbs.registerHelper('eq', (left: unknown, right: unknown) => left === right);

  app.use(
    session({
      secret: 'simple-secret-key',
      resave: false,
      saveUninitialized: false,
    }),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
    }),
  );

  app.useGlobalFilters(new PrismaExceptionFilter(), new HttpExceptionFilter());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Эрмитаж — REST API')
    .setDescription('RESTful API музея Эрмитаж: управление выставками, залами, заказами и отзывами')
    .setVersion('1.0')
    .addTag('users', 'Пользователи')
    .addTag('halls', 'Залы')
    .addTag('exhibitions', 'Выставки')
    .addTag('orders', 'Заказы (билеты)')
    .addTag('feedback', 'Отзывы')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  await app.listen(Number(process.env.PORT) || 3000);
}
bootstrap();
