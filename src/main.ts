import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  // Создаем директорию uploads при запуске, если она не существует
  const uploadsDir = join(process.cwd(), 'uploads');
  if (!existsSync(uploadsDir)) {
    mkdirSync(uploadsDir, { recursive: true });
  }

  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://localhost:3000',
      'http://royalbookingmanagement.ru',
      'https://royalbookingmanagement.ru',
      'http://www.royalbookingmanagement.ru',
      'https://www.royalbookingmanagement.ru'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
  });
  
  // Настраиваем обслуживание статических файлов
  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads/',
  });
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
