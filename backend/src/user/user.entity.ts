import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
} from 'typeorm';
import { UserRole } from '@/common/enums';
import { OrganizerProfile } from '@/organizers/organizer-profile.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.ATTENDEE })
  role: UserRole;

  @CreateDateColumn()
  createdAt: Date;

  @OneToOne(() => OrganizerProfile, (profile) => profile.user)
  organizer?: OrganizerProfile;
}
