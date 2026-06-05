import { httpClient } from "./httpClient";

export interface OrganizerSummary {
  id: number;
  name: string;
  avatarUrl?: string | null;
  city?: string | null;
}

export interface OrganizerProfile {
  id: number;
  name: string;
  avatarUrl?: string | null;
  bio?: string | null;
  instagram?: string | null;
  telegram?: string | null;
  website?: string | null;
  city?: string | null;
  eventsCount: number;
  totalParticipants: number;
  completedEvents: number;
  reviewsCount: number;
}

export interface UpdateOrganizerInput {
  name?: string;
  avatarUrl?: string;
  bio?: string;
  instagram?: string;
  telegram?: string;
  website?: string;
  city?: string;
}

export const organizerApi = {
  becomeOrganizer(input: { name: string }) {
    return httpClient
      .post<{
        id: number;
        email: string;
        role: string;
        organizer: OrganizerSummary;
      }>("/organizers/become", input)
      .then((r) => r.data);
  },
  getPublic(id: number) {
    return httpClient
      .get<OrganizerProfile>(`/organizers/${id}`)
      .then((r) => r.data);
  },
  getMine() {
    return httpClient
      .get<OrganizerProfile>("/organizers/me/profile")
      .then((r) => r.data);
  },
  updateMine(input: UpdateOrganizerInput) {
    return httpClient
      .patch<OrganizerProfile>("/organizers/me/profile", input)
      .then((r) => r.data);
  },
};
