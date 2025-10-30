import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Event } from '../event.entity';

@Entity()
export class EventImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @ManyToOne(() => Event, (event) => event.images, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'eventId' })
  event: Event;
}
