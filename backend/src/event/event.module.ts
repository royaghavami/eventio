import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { Event } from './event.entity';
import { EventImage } from './image/event-image.entity';
import { EventImageService } from './image/event-image.service';
import { OrganizersModule } from '@/organizers/organizers.module';
import { Reservation } from '@/reservations/reservation.entity';
import { OptionalJwtAuthGuard } from '@/common/guards/optional-jwt-auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event, EventImage, Reservation]),
    OrganizersModule,
  ],
  controllers: [EventController],
  providers: [EventService, EventImageService, OptionalJwtAuthGuard],
  exports: [EventService],
})
export class EventModule {}
