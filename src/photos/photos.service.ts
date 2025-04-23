import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { UpdatePhotoDto } from './dto/update-photo.dto';
import { Photo } from './entities/photo.entity';
import { CategoriesService } from 'src/categories/categories.service';
import { FilesService } from 'src/files/files.service';


@Injectable()
export class PhotosService {
  constructor(
    @InjectRepository(Photo)
    private photoRepository: Repository<Photo>,
    private categoriesService: CategoriesService,
    private filesService: FilesService,
  ) {}

  async create(createPhotoDto: CreatePhotoDto): Promise<Photo> {
    const photo = this.photoRepository.create({
      title: createPhotoDto.title,
      url: createPhotoDto.url,
    });

    if (createPhotoDto.categoryIds && createPhotoDto.categoryIds.length > 0) {
      photo.categories = await this.categoriesService.findByIds(createPhotoDto.categoryIds);
    }

    return this.photoRepository.save(photo);
  }

  async uploadPhoto(title: string, file: any, categoryId: number): Promise<Photo> {
    // Проверяем, существует ли категория
    const categories = await this.categoriesService.findByIds([categoryId]);
    
    if (!categories || categories.length === 0) {
      throw new NotFoundException(`Категория с ID ${categoryId} не найдена`);
    }

    // Создаем URL для доступа к файлу
    const fileUrl = this.filesService.getFileUrl(file.filename, categoryId);

    // Создаем новую запись в базе данных
    const photo = this.photoRepository.create({
      title,
      url: fileUrl,
      categories,
    });

    return this.photoRepository.save(photo);
  }

  async findAll(): Promise<Photo[]> {
    return this.photoRepository.find({
      relations: ['categories'],
    });
  }

  async findByCategory(categoryId: number): Promise<Photo[]> {
    return this.photoRepository
      .createQueryBuilder('photo')
      .innerJoinAndSelect('photo.categories', 'category')
      .where('category.id = :categoryId', { categoryId })
      .getMany();
  }

  async findByCategoryName(categoryName: string): Promise<Photo[]> {
    return this.photoRepository
      .createQueryBuilder('photo')
      .innerJoinAndSelect('photo.categories', 'category')
      .where('category.name = :categoryName', { categoryName })
      .getMany();
  }

  async findOne(id: number): Promise<Photo> {
    const photo = await this.photoRepository.findOne({
      where: { id },
      relations: ['categories'],
    });
    if (!photo) {
      throw new NotFoundException(`Photo with ID ${id} not found`);
    }
    return photo;
  }

  async update(id: number, updatePhotoDto: UpdatePhotoDto): Promise<Photo> {
    const photo = await this.findOne(id);
    
    if (updatePhotoDto.title) photo.title = updatePhotoDto.title;
    if (updatePhotoDto.url) photo.url = updatePhotoDto.url;
    
    if (updatePhotoDto.categoryIds !== undefined) {
      photo.categories = await this.categoriesService.findByIds(updatePhotoDto.categoryIds);
    }

    return this.photoRepository.save(photo);
  }

  async remove(id: number): Promise<void> {
    const photo = await this.findOne(id);
    
    // Если URL фото содержит /uploads/, то это локальный файл и его нужно удалить
    if (photo.url && photo.url.includes('/uploads/')) {
      // Извлекаем имя файла из URL
      const urlParts = photo.url.split('/');
      const filename = urlParts[urlParts.length - 1];
      const categoryId = urlParts[urlParts.length - 2];
      
      // Удаляем файл
      this.filesService.deleteFile(filename, categoryId);
    }
    
    await this.photoRepository.remove(photo);
  }
}
