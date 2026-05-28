import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
  Unique,
} from 'typeorm';
import { ReservationStatus } from '@/common/enums';
import { User } from '@/user/user.entity';
import { Event } from '@/event/event.entity';

@Entity('reservations')
@Unique(['eventId', 'userId'])
@Index(['eventId', 'status'])
export class Reservation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  eventId: number;

  @Column()
  userId: number;

  @Column({ type: 'enum', enum: ReservationStatus, default: ReservationStatus.PENDING })
  status: ReservationStatus;

  @Column({ type: 'int', nullable: true })
  position?: number | null;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Event, (event) => event.reservations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'eventId' })
  event: Event;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;
}
