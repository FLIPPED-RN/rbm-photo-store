import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { UpdatePhotoDto } from './dto/update-photo.dto';
import { Photo } from './entities/photo.entity';
import { CategoriesService } from 'src/categories/categories.service';


@Injectable()
export class PhotosService {
  constructor(
    @InjectRepository(Photo)
    private photoRepository: Repository<Photo>,
    private categoriesService: CategoriesService,
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
    await this.photoRepository.remove(photo);
  }
}
