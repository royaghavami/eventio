import { DataSource } from 'typeorm';
import { Event } from '@/event/event.entity';
import { EventImage } from './image/event-image.entity';

export const eventProviders = [
  {
    provide: 'EVENT_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Event),
    inject: ['DATA_SOURCE'],
  },
];