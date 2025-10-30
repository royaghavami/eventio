// src/event/event.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { EventImage } from './image/event-image.entity';

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'datetime' })
  startDate: Date;

  @Column({ type: 'datetime' })
  endDate: Date;

  @Column({ nullable: true })
  address?: string;

  @Column({ type: 'int', default: 0 })
  capacity: number;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => EventImage, (image) => image.event, { cascade: true })
  images: EventImage[];
}
