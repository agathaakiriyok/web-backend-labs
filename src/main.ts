import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as express from 'express';
import { join } from 'path';

const hbs = require('hbs');

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(express.static(join(__dirname, '..', 'public')));

  app.setViewEngine('hbs');
  app.setBaseViewsDir(join(__dirname, '..', 'views'));

  hbs.registerPartials(join(__dirname, '..', 'views/partials'));
  const fs = require('fs');
  const partialsDir = join(__dirname, '..', 'views', 'partials');
  fs.readdirSync(partialsDir).forEach((file: string) => {
    const name = file.replace('.hbs', '');
    const template = fs.readFileSync(join(partialsDir, file), 'utf8');
    hbs.registerPartial(name, template);
  });

  const port = process.env.PORT || 3000;

  await app.listen(port);
}
bootstrap();