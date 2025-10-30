import { httpClient } from "./httpClient";
import type { Event } from "@/entity/event/event";
import type { EventRepository } from "@/entity/event/event.repo";

export const eventApi: EventRepository = {
  async getAll() {
    const { data } = await httpClient.get<Event[]>("/events");
    return data;
  },

  async getById(id: number) {
    const { data } = await httpClient.get<Event>(`/events/${id}`);
    return data;
  },

  async create(event: Partial<Event>, images: File[]) {
    const payload = new FormData();
    Object.entries(event).forEach(([key, value]) => {
      if (value !== undefined && value !== null)
        payload.append(key, String(value));
    });
    images.slice(0, 3).forEach((file) => payload.append("images", file));

    const { data } = await httpClient.post<Event>("/events", payload, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  async update(id: number, event: Event) {
    const { data } = await httpClient.put<Event>(`/events/${id}`, event);
    return data;
  },

  async delete(id: number) {
    const { data } = await httpClient.delete<Event>(`/events/${id}`);
    return data;
  },
};
