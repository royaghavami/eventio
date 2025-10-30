import type { Genre } from "@/entity/genre/genre"

export interface EventImage {
  id: number;
  url: string;
}

export interface Event {
  id: string
  title: string
  description: string
  startDate: Date
  endDate: Date
  capacity?: number
  address?: string
  organizerId: string
  categories: Genre[] //TODO: keep simpler category not the whole entity
  sessions?: EventSession[]    
  isActive: boolean;
  images?: EventImage[];
}

export interface EventSession {
  date: Date
  startTime: string
  endTime: string
}