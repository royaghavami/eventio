import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { EventStatus } from '@/common/enums';
import { EventImage } from './image/event-image.entity';
import { OrganizerProfile } from '@/organizers/organizer-profile.entity';
import { Category } from '@/category/category.entity';
import { Reservation } from '@/reservations/reservation.entity';
import { SavedEvent } from '@/saved-event/saved-event.entity';

@Entity('events')
@Index(['city', 'startDate', 'status'])
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  organizerId: number;

  @ManyToOne(() => OrganizerProfile, (organizer) => organizer.events)
  @JoinColumn({ name: 'organizerId' })
  organizer: OrganizerProfile;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  city: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ type: 'float', nullable: true })
  lat?: number;

  @Column({ type: 'float', nullable: true })
  lng?: number;

  @Column({ type: 'datetime' })
  startDate: Date;

  @Column({ type: 'datetime' })
  endDate: Date;

  @Column({ type: 'int', default: 0 })
  capacity: number;

  @Column({ type: 'enum', enum: EventStatus, default: EventStatus.PENDING_REVIEW })
  status: EventStatus;

  @Column({ nullable: true })
  categoryId?: number;

  @ManyToOne(() => Category, (category) => category.events, { nullable: true })
  @JoinColumn({ name: 'categoryId' })
  category?: Category;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => EventImage, (image) => image.event, { cascade: true })
  images: EventImage[];

  @OneToMany(() => Reservation, (reservation) => reservation.event)
  reservations: Reservation[];

  @OneToMany(() => SavedEvent, (saved) => saved.event)
  savedBy: SavedEvent[];
}
