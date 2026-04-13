import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import session from 'express-session';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import hbs from 'hbs';
import * as dotenv from 'dotenv';

dotenv.config({ path: join(process.cwd(), '.env') });

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const root = process.cwd();
  app.useStaticAssets(join(root, 'public'));
  app.setBaseViewsDir(join(root, 'views'));
  app.setViewEngine('hbs');

  hbs.registerPartials(join(root, 'views', 'partials'), {
    rename: (name) => name,
  });
  hbs.registerHelper('eq', (left: unknown, right: unknown) => left === right);

  app.use(
    session({
      secret: 'simple-secret-key',
      resave: false,
      saveUninitialized: false,
    }),
  );

  await app.listen(Number(process.env.PORT) || 3000);
}
bootstrap();
