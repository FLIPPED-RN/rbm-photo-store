import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';

import { existsSync, mkdirSync } from 'fs';
import { FilesService } from './files.service';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: (req, file, cb) => {
          // Получаем categoryId из запроса
          const categoryId = req.params.categoryId || 'uncategorized';
          // Создаём путь для хранения - uploads/[categoryName]
          const uploadPath = join(process.cwd(), 'uploads', categoryId.toString());
          
          // Создаем директорию, если она не существует
          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath, { recursive: true });
          }
          
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          // Генерируем уникальное имя файла
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        // Проверяем, что файл - изображение
        if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          cb(null, true);
        } else {
          cb(new Error('Только изображения разрешены'), false);
        }
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // Ограничение размера файла до 5MB
      },
    }),
  ],
  providers: [FilesService],
  exports: [FilesService],
})
export class FilesModule {} 