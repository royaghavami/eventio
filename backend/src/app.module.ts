import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@/auth/auth.module';
import { UserModule } from '@/user/user.module';
import { OrganizersModule } from '@/organizers/organizers.module';
import { EventModule } from '@/event/event.module';
import { ReservationsModule } from '@/reservations/reservations.module';
import { AdminModule } from '@/admin/admin.module';
import { CategoryModule } from '@/category/category.module';
import { HealthModule } from '@/health/health.module';
import { validateEnv } from '@/config/env.validation';
import { buildTypeOrmConfig } from '@/config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate: validateEnv }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: buildTypeOrmConfig,
    }),
    UserModule,
    AuthModule,
    OrganizersModule,
    CategoryModule,
    EventModule,
    ReservationsModule,
    AdminModule,
    HealthModule,
  ],
})
export class AppModule {}
