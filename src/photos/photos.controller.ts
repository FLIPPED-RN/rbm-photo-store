import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpCode, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { PhotosService } from './photos.service';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { UpdatePhotoDto } from './dto/update-photo.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';

@Controller('photos')
export class PhotosController {
  constructor(private readonly photosService: PhotosService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createPhotoDto: CreatePhotoDto) {
    return this.photosService.create(createPhotoDto);
  }

  @Post('upload/:categoryId')
  @UseInterceptors(FileInterceptor('file'))
  async uploadPhoto(
    @UploadedFile() file: Express.Multer.File,
    @Param('categoryId') categoryId: string,
    @Body('title') title: string,
  ) {
    if (!file) {
      throw new BadRequestException('Файл не найден');
    }

    return this.photosService.uploadPhoto(title, file, +categoryId);
  }

  @Get()
  findAll() {
    return this.photosService.findAll();
  }

  @Get('by-category/:categoryId')
  findByCategory(@Param('categoryId') categoryId: string) {
    return this.photosService.findByCategory(+categoryId);
  }

  @Get('by-category-name/:name')
  findByCategoryName(@Param('name') name: string) {
    return this.photosService.findByCategoryName(name);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.photosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePhotoDto: UpdatePhotoDto) {
    return this.photosService.update(+id, updatePhotoDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.photosService.remove(+id);
  }
}
