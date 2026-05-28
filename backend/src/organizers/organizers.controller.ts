import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { OrganizersService } from './organizers.service';
import { UpdateOrganizerDto } from './dto/update-organizer.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { UserRole } from '@/common/enums';
import { JwtPayload } from '@/auth/jwt-payload.interface';

@Controller('organizers')
export class OrganizersController {
  constructor(private readonly organizersService: OrganizersService) {}

  @Get('me/profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ORGANIZER, UserRole.ADMIN)
  async findMine(@CurrentUser() user: JwtPayload) {
    const profile = await this.organizersService.findByUserId(user.sub);
    return {
      id: profile.id,
      name: profile.name,
      avatarUrl: profile.avatarUrl,
      bio: profile.bio,
      instagram: profile.instagram,
      telegram: profile.telegram,
      website: profile.website,
      city: profile.city,
      eventsCount: profile.eventsCount,
      totalParticipants: profile.totalParticipants,
      completedEvents: profile.completedEvents,
      reviewsCount: profile.reviewsCount,
    };
  }

  @Patch('me/profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ORGANIZER, UserRole.ADMIN)
  updateMine(@CurrentUser() user: JwtPayload, @Body() dto: UpdateOrganizerDto) {
    return this.organizersService.updateMine(user.sub, dto);
  }

  @Get(':id')
  findPublic(@Param('id') id: string) {
    return this.organizersService.findPublic(Number(id));
  }
}
