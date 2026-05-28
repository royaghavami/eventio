import {
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminEventsQueryDto } from './dto/admin-events-query.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { UserRole } from '@/common/enums';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('events')
  listEvents(@Query() query: AdminEventsQueryDto) {
    return this.adminService.listEvents(query.status);
  }

  @Patch('events/:id/approve')
  approve(@Param('id') id: string) {
    return this.adminService.approveEvent(Number(id));
  }

  @Patch('events/:id/reject')
  reject(@Param('id') id: string) {
    return this.adminService.rejectEvent(Number(id));
  }
}
