import {
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { UserRole } from '@/common/enums';
import { JwtPayload } from '@/auth/jwt-payload.interface';
import { OrganizersService } from '@/organizers/organizers.service';

@Controller()
export class ReservationsController {
  constructor(
    private readonly reservationsService: ReservationsService,
    private readonly organizersService: OrganizersService,
  ) {}

  @Get('events/:eventId/reservations/stats')
  stats(@Param('eventId') eventId: string) {
    return this.reservationsService.getEventStats(Number(eventId));
  }

  @Get('events/:eventId/reservations/me')
  @UseGuards(JwtAuthGuard)
  myReservation(
    @Param('eventId') eventId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.reservationsService.findMineForEvent(
      Number(eventId),
      user.sub,
    );
  }

  @Post('events/:eventId/reservations')
  @UseGuards(JwtAuthGuard)
  reserve(
    @Param('eventId') eventId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.reservationsService.reserve(Number(eventId), user.sub);
  }

  @Delete('reservations/:id')
  @UseGuards(JwtAuthGuard)
  cancel(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.reservationsService.cancel(Number(id), user.sub);
  }

  @Patch('reservations/:id/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ORGANIZER, UserRole.ADMIN)
  async approve(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
  ) {
    const profile = await this.organizersService.findByUserId(user.sub);
    return this.reservationsService.approveByOrganizer(
      Number(id),
      user.sub,
      profile.id,
    );
  }
}
