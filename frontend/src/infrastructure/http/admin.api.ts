import { httpClient } from "./httpClient";
import type { Event, EventStatus } from "@/entity/event/event";

export const adminApi = {
  listEvents(status?: EventStatus) {
    return httpClient
      .get<Event[]>("/admin/events", { params: status ? { status } : {} })
      .then((r) => r.data);
  },
  approveEvent(id: number) {
    return httpClient
      .patch<Event>(`/admin/events/${id}/approve`)
      .then((r) => r.data);
  },
  rejectEvent(id: number) {
    return httpClient
      .patch<Event>(`/admin/events/${id}/reject`)
      .then((r) => r.data);
  },
};
