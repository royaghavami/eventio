import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { DatabaseModule } from '@/database/database.module';
import { eventProviders } from '@/event/event.providers';
import { EventImageService } from './image/event-image.service';
import { eventImageProviders } from './image/event-image.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [EventController],
  providers: [
    EventService,
    EventImageService,
    ...eventImageProviders,
    ...eventProviders,
  ],
})
export class EventModule {}
