import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from '@/user/user.entity';
import { Event } from '@/event/event.entity';

@Entity('organizer_profiles')
export class OrganizerProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  userId: number;

  @OneToOne(() => User, (user) => user.organizer, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  name: string;

  @Column({ nullable: true })
  avatarUrl?: string;

  @Column({ type: 'text', nullable: true })
  bio?: string;

  @Column({ nullable: true })
  instagram?: string;

  @Column({ nullable: true })
  telegram?: string;

  @Column({ nullable: true })
  website?: string;

  @Column({ nullable: true })
  city?: string;

  @Column({ type: 'int', default: 0 })
  eventsCount: number;

  @Column({ type: 'int', default: 0 })
  totalParticipants: number;

  @Column({ type: 'int', default: 0 })
  completedEvents: number;

  @Column({ type: 'int', default: 0 })
  reviewsCount: number;

  @OneToMany(() => Event, (event) => event.organizer)
  events: Event[];
}
