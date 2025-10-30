import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Event } from '@/event/event.entity';
import { EventImage } from './image/event-image.entity';
import { promises as fs } from 'fs'
import { join } from 'path'

@Injectable()
export class EventService {
  constructor(
    @Inject('EVENT_REPOSITORY')
    private readonly eventRepo: Repository<Event>,
    @Inject('EVENT_IMAGE_REPOSITORY')
    private readonly imageRepo: Repository<EventImage>,
  ) {}

  async findAll(): Promise<Event[]> {
    return this.eventRepo.find({ relations: ['images'] });
  }

  async findOne(id: number): Promise<Event | null> {
    return this.eventRepo.findOne({ where: { id }, relations: ['images'] });
  }

    async create(event: Partial<Event>): Promise<Event> {
    const newEvent = this.eventRepo.create(event);
    return this.eventRepo.save(newEvent);
    }

  async update(id: number, event: Partial<Event>): Promise<Event> {
    const existing = await this.eventRepo.findOneBy({ id });
    if (!existing) {
      throw new NotFoundException(`Event with id ${id} not found`);
    }
    const updated = this.eventRepo.merge(existing, event);
    return this.eventRepo.save(updated);
  }

  async delete(id: number): Promise<void> {
    const event = await this.eventRepo.findOne({
      where: { id },
      relations: ['images'], 
    })
    if (!event) throw new NotFoundException(`Event with id ${id} not found`)

    if (event.images?.length) {
      for (const img of event.images) {
        try {
          await fs.unlink(join(process.cwd(), img.url)) 
        } catch (err) {
          console.warn(`Failed to delete file ${img.url}:`, err)
        }
      }
      await this.imageRepo.delete(event.images.map(i => i.id))
    }
    await this.eventRepo.delete(id)
  }
}
