import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '@/user/user.entity';
import { OrganizerProfile } from '@/organizers/organizer-profile.entity';
import { Event } from '@/event/event.entity';
import { EventImage } from '@/event/image/event-image.entity';
import { Category } from '@/category/category.entity';
import { Reservation } from '@/reservations/reservation.entity';
import { SavedEvent } from '@/saved-event/saved-event.entity';

export const buildTypeOrmConfig = (
  config: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'mysql',
  host: config.getOrThrow<string>('DB_HOST'),
  port: parseInt(config.getOrThrow<string>('DB_PORT'), 10),
  username: config.getOrThrow<string>('DB_USER'),
  password: config.getOrThrow<string>('DB_PASSWORD'),
  database: config.getOrThrow<string>('DB_NAME'),
  entities: [
    User,
    OrganizerProfile,
    Event,
    EventImage,
    Category,
    Reservation,
    SavedEvent,
  ],
  synchronize:
    config.get('DB_SYNCHRONIZE') === 'true' ||
    config.get('NODE_ENV') !== 'production',
  retryAttempts: 10,
  retryDelay: 5000,
});
