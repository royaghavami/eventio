import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Event } from '../event.entity';

@Entity('event_images')
export class EventImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  eventId: number;

  @Column()
  url: string;

  @Column({ type: 'int', default: 0 })
  sort: number;

  @ManyToOne(() => Event, (event) => event.images, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'eventId' })
  event: Event;
}
