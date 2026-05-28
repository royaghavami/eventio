import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { EventModule } from '@/event/event.module';

@Module({
  imports: [EventModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
