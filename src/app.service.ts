import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'ЭТО API для хранения фотографий RBM';
  }
}
