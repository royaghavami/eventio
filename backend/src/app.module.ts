import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/user/user.entity';
import { OrganizerProfile } from '@/organizers/organizer-profile.entity';
import { Event } from '@/event/event.entity';
import { EventImage } from '@/event/image/event-image.entity';
import { Category } from '@/category/category.entity';
import { Reservation } from '@/reservations/reservation.entity';
import { SavedEvent } from '@/saved-event/saved-event.entity';
import { AuthModule } from '@/auth/auth.module';
import { UserModule } from '@/user/user.module';
import { OrganizersModule } from '@/organizers/organizers.module';
import { EventModule } from '@/event/event.module';
import { ReservationsModule } from '@/reservations/reservations.module';
import { AdminModule } from '@/admin/admin.module';
import { CategoryModule } from '@/category/category.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST ?? '127.0.0.1',
      port: Number(process.env.DB_PORT ?? 3306),
      username: process.env.DB_USER ?? 'root',
      password: process.env.DB_PASSWORD ?? 'password',
      database: process.env.DB_NAME ?? 'market',
      entities: [
        User,
        OrganizerProfile,
        Event,
        EventImage,
        Category,
        Reservation,
        SavedEvent,
      ],
      synchronize: true,
    }),
    UserModule,
    AuthModule,
    OrganizersModule,
    CategoryModule,
    EventModule,
    ReservationsModule,
    AdminModule,
  ],
})
export class AppModule {}
