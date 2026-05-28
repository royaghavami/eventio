import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { promises as fs } from 'fs';
import { join } from 'path';
import { Event } from '@/event/event.entity';
import { EventImage } from './image/event-image.entity';
import { EventStatus, ReservationStatus, UserRole } from '@/common/enums';
import { DiscoverEventsDto, EventSort } from './dto/discover-events.dto';
import { CreateEventDto } from './dto/create-event.dto';
import { OrganizersService } from '@/organizers/organizers.service';
import { Reservation } from '@/reservations/reservation.entity';
import { JwtPayload } from '@/auth/jwt-payload.interface';

@Injectable()
export class EventService {
  /** Set EVENT_REQUIRE_ADMIN_APPROVAL=true to hold new events until admin approves. */
  private readonly requireAdminApproval =
    process.env.EVENT_REQUIRE_ADMIN_APPROVAL === 'true';

  private initialEventStatus() {
    return this.requireAdminApproval
      ? EventStatus.PENDING_REVIEW
      : EventStatus.PUBLISHED;
  }

  constructor(
    @InjectRepository(Event)
    private readonly eventRepo: Repository<Event>,
    @InjectRepository(EventImage)
    private readonly imageRepo: Repository<EventImage>,
    @InjectRepository(Reservation)
    private readonly reservationRepo: Repository<Reservation>,
    private readonly organizersService: OrganizersService,
  ) {}

  async discover(query: DiscoverEventsDto) {
    const qb = this.eventRepo
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.images', 'images')
      .leftJoinAndSelect('event.category', 'category')
      .leftJoinAndSelect('event.organizer', 'organizer')
      .where('event.status = :status', { status: EventStatus.PUBLISHED })
      .andWhere('event.isActive = :active', { active: true });

    if (query.search) {
      qb.andWhere('event.title LIKE :search', {
        search: `%${query.search}%`,
      });
    }
    if (query.city) {
      qb.andWhere('event.city = :city', { city: query.city });
    }
    if (query.categoryId) {
      qb.andWhere('event.categoryId = :categoryId', {
        categoryId: query.categoryId,
      });
    }
    if (query.from) {
      qb.andWhere('event.startDate >= :from', { from: query.from });
    }
    if (query.to) {
      qb.andWhere('event.startDate <= :to', { to: query.to });
    }

    if (query.sort !== EventSort.POPULAR) {
      qb.orderBy('event.startDate', 'ASC');
    }

    const events = await qb.getMany();
    let enriched = await Promise.all(events.map((e) => this.enrichEvent(e)));

    if (query.sort === EventSort.POPULAR) {
      enriched = enriched.sort(
        (a, b) => b.stats.approvedCount - a.stats.approvedCount,
      );
    }

    return enriched;
  }

  async findMine(userId: number) {
    const profile = await this.organizersService.findByUserId(userId);
    const events = await this.eventRepo.find({
      where: { organizerId: profile.id },
      relations: ['images', 'category', 'organizer'],
      order: { startDate: 'ASC' },
    });
    return Promise.all(events.map((e) => this.enrichEvent(e)));
  }

  async findOne(id: number, user?: JwtPayload) {
    const event = await this.eventRepo.findOne({
      where: { id },
      relations: ['images', 'category', 'organizer'],
    });
    if (!event) {
      throw new NotFoundException(`Event with id ${id} not found`);
    }

    const canView =
      event.status === EventStatus.PUBLISHED ||
      user?.role === UserRole.ADMIN ||
      (user?.role === UserRole.ORGANIZER &&
        (await this.isOrganizerOwner(event.organizerId, user.sub)));

    if (!canView) {
      throw new NotFoundException(`Event with id ${id} not found`);
    }

    return this.enrichEvent(event);
  }

  async create(userId: number, dto: CreateEventDto) {
    const profile = await this.organizersService.findByUserId(userId);
    const event = this.eventRepo.create({
      ...dto,
      startDate: new Date(dto.startDate),
      endDate: new Date(dto.endDate),
      organizerId: profile.id,
      status: this.initialEventStatus(),
    });
    const saved = await this.eventRepo.save(event);
    await this.organizersService.incrementEventsCount(profile.id);
    return this.findOne(saved.id, {
      sub: userId,
      email: '',
      role: UserRole.ORGANIZER,
    });
  }

  async createFromBody(userId: number, body: Partial<Event>) {
    const profile = await this.organizersService.findByUserId(userId);
    const event = this.eventRepo.create({
      title: body.title!,
      description: body.description!,
      city: body.city ?? 'تهران',
      address: body.address,
      startDate: new Date(body.startDate!),
      endDate: new Date(body.endDate!),
      capacity: body.capacity ?? 10,
      organizerId: profile.id,
      status: this.initialEventStatus(),
      categoryId: body.categoryId,
    });
    const saved = await this.eventRepo.save(event);
    await this.organizersService.incrementEventsCount(profile.id);
    return saved;
  }

  async update(
    id: number,
    userId: number,
    body: Partial<Event>,
    isAdmin: boolean,
  ) {
    const event = await this.eventRepo.findOne({ where: { id } });
    if (!event) {
      throw new NotFoundException(`Event with id ${id} not found`);
    }
    if (!isAdmin) {
      await this.assertOrganizerOwner(event.organizerId, userId);
    }
    const updated = this.eventRepo.merge(event, body);
    return this.eventRepo.save(updated);
  }

  async delete(id: number, userId: number, isAdmin: boolean) {
    const event = await this.eventRepo.findOne({
      where: { id },
      relations: ['images'],
    });
    if (!event) {
      throw new NotFoundException(`Event with id ${id} not found`);
    }
    if (!isAdmin) {
      await this.assertOrganizerOwner(event.organizerId, userId);
    }

    if (event.images?.length) {
      for (const img of event.images) {
        try {
          const filePath = img.url.startsWith('/')
            ? join(process.cwd(), img.url.slice(1))
            : join(process.cwd(), img.url);
          await fs.unlink(filePath);
        } catch (err) {
          console.warn(`Failed to delete file ${img.url}:`, err);
        }
      }
      await this.imageRepo.delete(event.images.map((i) => i.id));
    }
    await this.eventRepo.delete(id);
  }

  async setStatus(id: number, status: EventStatus) {
    const event = await this.eventRepo.findOne({ where: { id } });
    if (!event) {
      throw new NotFoundException(`Event with id ${id} not found`);
    }
    event.status = status;
    return this.eventRepo.save(event);
  }

  async findByStatus(status: EventStatus) {
    const events = await this.eventRepo.find({
      where: { status },
      relations: ['images', 'category', 'organizer'],
      order: { createdAt: 'DESC' },
    });
    return Promise.all(events.map((e) => this.enrichEvent(e)));
  }

  private async enrichEvent(event: Event) {
    const approvedCount = await this.reservationRepo.count({
      where: { eventId: event.id, status: ReservationStatus.APPROVED },
    });
    const waitlistCount = await this.reservationRepo.count({
      where: { eventId: event.id, status: ReservationStatus.WAITLISTED },
    });
    return {
      ...event,
      stats: {
        approvedCount,
        waitlistCount,
        remainingSpots: Math.max(0, event.capacity - approvedCount),
        isFull: approvedCount >= event.capacity,
      },
    };
  }

  private async isOrganizerOwner(organizerId: number, userId: number) {
    try {
      const profile = await this.organizersService.findByUserId(userId);
      return profile.id === organizerId;
    } catch {
      return false;
    }
  }

  private async assertOrganizerOwner(organizerId: number, userId: number) {
    const ok = await this.isOrganizerOwner(organizerId, userId);
    if (!ok) {
      throw new ForbiddenException('Not allowed to modify this event');
    }
  }
}
