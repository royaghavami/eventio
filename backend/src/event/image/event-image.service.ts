import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventImage } from './event-image.entity';

@Injectable()
export class EventImageService {
  constructor(
    @InjectRepository(EventImage)
    private readonly imageRepo: Repository<EventImage>,
  ) {}

  create(url: string, eventId: number) {
    const image = this.imageRepo.create({ url, eventId });
    return this.imageRepo.save(image);
  }
}
