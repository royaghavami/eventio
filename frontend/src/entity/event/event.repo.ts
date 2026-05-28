import type { DiscoverEventsParams, Event } from "@/entity/event/event";

export interface EventRepository {
  getAll(params?: DiscoverEventsParams): Promise<Event[]>;
  getById(id: number): Promise<Event>;
  getMine?(): Promise<Event[]>;
  create(event: Partial<Event>, images: File[]): Promise<Event>;
  update(id: number, event: Partial<Event>): Promise<Event>;
  delete(id: number): Promise<Event>;
}
