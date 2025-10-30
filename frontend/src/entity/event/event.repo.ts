import type { Event } from '@/entity/event/event'

export interface EventRepository {
  getAll(): Promise<Event[]>
  getById(id: number): Promise<Event>
  create(event: Partial<Event>, images: File[]): Promise<Event>
  update(id: number, event: Partial<Event>): Promise<Event>
  delete(id: number): Promise<Event>
}
