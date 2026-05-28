import { httpClient } from "./httpClient";

export type ReservationStatus =
  | "PENDING"
  | "APPROVED"
  | "WAITLISTED"
  | "CANCELLED";

export interface Reservation {
  id: number;
  eventId: number;
  userId: number;
  status: ReservationStatus;
  position?: number | null;
  createdAt: string;
}

export interface EventReservationStats {
  approvedCount: number;
  waitlistCount: number;
  remainingSpots: number;
  isFull: boolean;
}

export const reservationApi = {
  getStats(eventId: number) {
    return httpClient
      .get<EventReservationStats>(`/events/${eventId}/reservations/stats`)
      .then((r) => r.data);
  },
  getMine(eventId: number) {
    return httpClient
      .get<Reservation | null>(`/events/${eventId}/reservations/me`)
      .then((r) => r.data);
  },
  reserve(eventId: number) {
    return httpClient
      .post<Reservation>(`/events/${eventId}/reservations`)
      .then((r) => r.data);
  },
  cancel(reservationId: number) {
    return httpClient
      .delete<Reservation>(`/reservations/${reservationId}`)
      .then((r) => r.data);
  },
};
