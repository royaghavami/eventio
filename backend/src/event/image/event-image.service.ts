// event-image.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { EventImage } from './event-image.entity';

@Injectable()
export class EventImageService {
  constructor(
    @Inject('EVENT_IMAGE_REPOSITORY')
    private readonly imageRepository: Repository<EventImage>,
  ) {}

  async create(url: string, eventId: number): Promise<EventImage> {
    const image = this.imageRepository.create({
      url,
      event: { id: eventId } as any,
    });
    return this.imageRepository.save(image);
  }
  
  async findByEvent(eventId: number): Promise<EventImage[]> {
    return this.imageRepository.find({ where: { event: { id: eventId } } });
  }
}
