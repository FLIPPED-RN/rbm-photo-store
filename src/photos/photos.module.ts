import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhotosService } from './photos.service';
import { PhotosController } from './photos.controller';
import { Photo } from './entities/photo.entity';
import { CategoriesModule } from '../categories/categories.module';
import { FilesModule } from '../files/files.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Photo]),
    CategoriesModule,
    FilesModule
  ],
  controllers: [PhotosController],
  providers: [PhotosService],
})
export class PhotosModule {}
