import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Delete,
  Param,
  NotFoundException,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { EventService } from './event.service';
import { Event } from '@/event/event.entity';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { EventImageService } from './image/event-image.service';
import { EventImage } from './image/event-image.entity';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService, private readonly imageService: EventImageService) {}

  @Get()
  async getAll(): Promise<Event[]> {
    return this.eventService.findAll();
  }

  @Get(':id')
  async getOne(@Param('id') id: string): Promise<Event> {
    const event = await this.eventService.findOne(Number(id));
    if (!event) {
      throw new NotFoundException(`Event with id ${id} not found`);
    }
    return event;
  }

@Post()
@UseInterceptors(
  FileFieldsInterceptor(
    [{ name: 'images', maxCount: 3 }],
    {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
    },
  ),
)
async create(
  @UploadedFiles() files: { images?: Express.Multer.File[] },
  @Body() body: Partial<Event>,
): Promise<Event> {
  const event = await this.eventService.create(body);

  if (files?.images?.length) {
    const uploadedImages: EventImage[] = []; 
    for (const file of files.images) {
      // file.filename is now guaranteed
      const url = `/uploads/${file.filename}`;
      const img = await this.imageService.create(url, event.id);
      uploadedImages.push(img);
    }
    event.images = uploadedImages;
  }

  return event;
}

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: Partial<Event>,
  ): Promise<Event> {
    return this.eventService.update(Number(id), body);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.eventService.delete(Number(id));
  }
}
