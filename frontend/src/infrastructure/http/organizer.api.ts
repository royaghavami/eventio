import { httpClient } from "./httpClient";

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
