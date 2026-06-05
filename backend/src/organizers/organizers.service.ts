import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRole } from '@/common/enums';
import { UserService } from '@/user/user.service';
import { OrganizerProfile } from './organizer-profile.entity';
import { UpdateOrganizerDto } from './dto/update-organizer.dto';

@Injectable()
export class OrganizersService {
  constructor(
    @InjectRepository(OrganizerProfile)
    private readonly profileRepo: Repository<OrganizerProfile>,
    private readonly userService: UserService,
  ) {}

  createProfile(userId: number, name: string) {
    const profile = this.profileRepo.create({ userId, name });
    return this.profileRepo.save(profile);
  }

  async becomeOrganizer(userId: number, name: string) {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.organizer) {
      return { profile: user.organizer, user };
    }

    const profile = await this.createProfile(userId, name);

    if (user.role === UserRole.ATTENDEE) {
      const updated = await this.userService.updateRole(
        userId,
        UserRole.ORGANIZER,
      );
      return { profile, user: updated! };
    }

    const refreshed = await this.userService.findById(userId);
    return { profile, user: refreshed! };
  }

  async findPublic(id: number) {
    const profile = await this.profileRepo.findOne({ where: { id } });
    if (!profile) {
      throw new NotFoundException('Organizer not found');
    }
    return this.toPublic(profile);
  }

  async findByUserId(userId: number) {
    const profile = await this.profileRepo.findOne({ where: { userId } });
    if (!profile) {
      throw new NotFoundException('Organizer profile not found');
    }
    return profile;
  }

  async updateMine(userId: number, dto: UpdateOrganizerDto) {
    const profile = await this.findByUserId(userId);
    Object.assign(profile, dto);
    return this.profileRepo.save(profile);
  }

  async incrementEventsCount(organizerId: number, delta = 1) {
    await this.profileRepo.increment({ id: organizerId }, 'eventsCount', delta);
  }

  private toPublic(profile: OrganizerProfile) {
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
}
