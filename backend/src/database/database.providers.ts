import { DataSource } from 'typeorm';
import { Event } from '@/event/event.entity'
import { EventImage } from '@/event/image/event-image.entity';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'mysql',
        host: '127.0.0.1',
        port: 3306,
        username: 'root',
        password: 'password', 
        database: 'market',
        entities: [Event, EventImage], //TODO: add all your entities here
        synchronize: true,  
      });
      return dataSource.initialize();
    },
  },
];
