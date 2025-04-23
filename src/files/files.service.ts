import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { existsSync, unlinkSync } from 'fs';

@Injectable()
export class FilesService {
  // Получить полный путь к файлу
  getStaticFilePath(filename: string, categoryId: string | number): string {
    return join(process.cwd(), 'uploads', categoryId.toString(), filename);
  }

  // Получить URL для доступа к файлу через HTTP
  getFileUrl(filename: string, categoryId: string | number): string {
    return `/uploads/${categoryId}/${filename}`;
  }

  // Удалить файл
  deleteFile(filename: string, categoryId: string | number): boolean {
    const filePath = this.getStaticFilePath(filename, categoryId);
    if (existsSync(filePath)) {
      unlinkSync(filePath);
      return true;
    }
    return false;
  }
} 