import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Reservation } from './reservation.entity';
import { Event } from '@/event/event.entity';
import { EventStatus, ReservationStatus } from '@/common/enums';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepo: Repository<Reservation>,
    private readonly dataSource: DataSource,
  ) {}

  async getEventStats(eventId: number) {
    const [approvedCount, waitlistCount] = await Promise.all([
      this.reservationRepo.count({
        where: { eventId, status: ReservationStatus.APPROVED },
      }),
      this.reservationRepo.count({
        where: { eventId, status: ReservationStatus.WAITLISTED },
      }),
    ]);
    const event = await this.dataSource.getRepository(Event).findOne({
      where: { id: eventId },
    });
    const capacity = event?.capacity ?? 0;
    return {
      approvedCount,
      waitlistCount,
      remainingSpots: Math.max(0, capacity - approvedCount),
      isFull: approvedCount >= capacity,
    };
  }

  async findMineForEvent(eventId: number, userId: number) {
    return this.reservationRepo.findOne({ where: { eventId, userId } });
  }

  async reserve(eventId: number, userId: number) {
    return this.dataSource.transaction(async (manager) => {
      const eventRepo = manager.getRepository(Event);
      const reservationRepo = manager.getRepository(Reservation);

      const event = await eventRepo.findOne({
        where: { id: eventId, status: EventStatus.PUBLISHED },
        lock: { mode: 'pessimistic_write' },
      });
      if (!event) {
        throw new NotFoundException('Event not found or not published');
      }

      let reservation = await reservationRepo.findOne({
        where: { eventId, userId },
        lock: { mode: 'pessimistic_write' },
      });

      if (
        reservation &&
        reservation.status !== ReservationStatus.CANCELLED
      ) {
        throw new ConflictException('You already have a reservation for this event');
      }

      const approvedCount = await reservationRepo.count({
        where: { eventId, status: ReservationStatus.APPROVED },
      });

      let status: ReservationStatus;
      let position: number | null = null;

      if (approvedCount < event.capacity) {
        status = ReservationStatus.APPROVED;
      } else {
        status = ReservationStatus.WAITLISTED;
        const result = await reservationRepo
          .createQueryBuilder('r')
          .select('MAX(r.position)', 'max')
          .where('r.eventId = :eventId', { eventId })
          .andWhere('r.status = :status', {
            status: ReservationStatus.WAITLISTED,
          })
          .getRawOne<{ max: string | null }>();
        position = (Number(result?.max) || 0) + 1;
      }

      if (reservation) {
        reservation.status = status;
        reservation.position = position;
      } else {
        reservation = reservationRepo.create({
          eventId,
          userId,
          status,
          position,
        });
      }

      return reservationRepo.save(reservation);
    });
  }

  async cancel(reservationId: number, userId: number) {
    return this.dataSource.transaction(async (manager) => {
      const reservationRepo = manager.getRepository(Reservation);
      const reservation = await reservationRepo.findOne({
        where: { id: reservationId, userId },
        lock: { mode: 'pessimistic_write' },
      });
      if (!reservation) {
        throw new NotFoundException('Reservation not found');
      }
      if (reservation.status === ReservationStatus.CANCELLED) {
        throw new BadRequestException('Reservation already cancelled');
      }

      const wasApproved = reservation.status === ReservationStatus.APPROVED;
      const wasWaitlisted = reservation.status === ReservationStatus.WAITLISTED;
      const freedPosition = reservation.position;

      reservation.status = ReservationStatus.CANCELLED;
      reservation.position = null;
      await reservationRepo.save(reservation);

      if (wasApproved) {
        await this.promoteNextWaitlisted(manager, reservation.eventId);
      } else if (wasWaitlisted && freedPosition != null) {
        await reservationRepo
          .createQueryBuilder()
          .update(Reservation)
          .set({ position: () => 'position - 1' })
          .where('eventId = :eventId', { eventId: reservation.eventId })
          .andWhere('status = :status', {
            status: ReservationStatus.WAITLISTED,
          })
          .andWhere('position > :pos', { pos: freedPosition })
          .execute();
      }

      return reservation;
    });
  }

  async approveByOrganizer(
    reservationId: number,
    organizerUserId: number,
    organizerProfileId: number,
  ) {
    return this.dataSource.transaction(async (manager) => {
      const reservationRepo = manager.getRepository(Reservation);
      const eventRepo = manager.getRepository(Event);

      const reservation = await reservationRepo.findOne({
        where: { id: reservationId },
        relations: ['event'],
        lock: { mode: 'pessimistic_write' },
      });
      if (!reservation) {
        throw new NotFoundException('Reservation not found');
      }
      if (reservation.event.organizerId !== organizerProfileId) {
        throw new ForbiddenException('Not your event');
      }
      if (
        reservation.status !== ReservationStatus.PENDING &&
        reservation.status !== ReservationStatus.WAITLISTED
      ) {
        throw new BadRequestException('Reservation cannot be approved');
      }

      const event = await eventRepo.findOne({
        where: { id: reservation.eventId },
        lock: { mode: 'pessimistic_write' },
      });
      if (!event) {
        throw new NotFoundException('Event not found');
      }

      const approvedCount = await reservationRepo.count({
        where: {
          eventId: event.id,
          status: ReservationStatus.APPROVED,
        },
      });
      if (approvedCount >= event.capacity) {
        throw new BadRequestException('Event is at capacity');
      }

      const oldPosition = reservation.position;
      reservation.status = ReservationStatus.APPROVED;
      reservation.position = null;
      await reservationRepo.save(reservation);

      if (oldPosition != null) {
        await reservationRepo
          .createQueryBuilder()
          .update(Reservation)
          .set({ position: () => 'position - 1' })
          .where('eventId = :eventId', { eventId: event.id })
          .andWhere('status = :status', {
            status: ReservationStatus.WAITLISTED,
          })
          .andWhere('position > :pos', { pos: oldPosition })
          .execute();
      }

      return reservation;
    });
  }

  private async promoteNextWaitlisted(
    manager: DataSource['manager'],
    eventId: number,
  ) {
    const reservationRepo = manager.getRepository(Reservation);
    const eventRepo = manager.getRepository(Event);

    const event = await eventRepo.findOne({
      where: { id: eventId },
      lock: { mode: 'pessimistic_write' },
    });
    if (!event) return;

    const approvedCount = await reservationRepo.count({
      where: { eventId, status: ReservationStatus.APPROVED },
    });
    if (approvedCount >= event.capacity) return;

    const next = await reservationRepo.findOne({
      where: { eventId, status: ReservationStatus.WAITLISTED },
      order: { position: 'ASC' },
      lock: { mode: 'pessimistic_write' },
    });
    if (!next) return;

    const oldPosition = next.position;
    next.status = ReservationStatus.APPROVED;
    next.position = null;
    await reservationRepo.save(next);

    if (oldPosition != null) {
      await reservationRepo
        .createQueryBuilder()
        .update(Reservation)
        .set({ position: () => 'position - 1' })
        .where('eventId = :eventId', { eventId })
        .andWhere('status = :status', {
          status: ReservationStatus.WAITLISTED,
        })
        .andWhere('position > :pos', { pos: oldPosition })
        .execute();
    }
  }
}
