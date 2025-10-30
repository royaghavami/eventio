import { DataSource } from 'typeorm';
import { EventImage } from './event-image.entity';

export const eventImageProviders = [
  {
    provide: 'EVENT_IMAGE_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(EventImage),
    inject: ['DATA_SOURCE'],
  },
];