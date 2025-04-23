export class CreatePhotoDto {
  title: string;
  url?: string;
  categoryIds?: number[];
  // Поле file будет содержать загруженный файл
  // Это поле не будет сохранено в БД напрямую
  // file?: Express.Multer.File;
}
