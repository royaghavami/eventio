import type { Genre } from "@/entity/genre/genre";
import type { OrganizerProfile } from "@/infrastructure/http/organizer.api";
import type { EventReservationStats } from "@/infrastructure/http/reservation.api";

export interface EventImage {
  id: number;
  url: string;
}

export type EventStatus =
  | "DRAFT"
  | "PENDING_REVIEW"
  | "PUBLISHED"
  | "REJECTED"
  | "CANCELLED";

export interface Event {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  capacity: number;
  city: string;
  address?: string;
  lat?: number;
  lng?: number;
  status?: EventStatus;
  organizerId?: number;
  organizer?: OrganizerProfile;
  categoryId?: number;
  categories?: Genre[];
  category?: Genre;
  sessions?: EventSession[];
  isActive: boolean;
  images?: EventImage[];
  stats?: EventReservationStats;
}

export interface EventSession {
  date: Date;
  startTime: string;
  endTime: string;
}

export interface DiscoverEventsParams {
  search?: string;
  city?: string;
  categoryId?: number;
  from?: string;
  to?: string;
  sort?: "upcoming" | "popular";
}
