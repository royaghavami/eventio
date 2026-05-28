export type UserRole = "ATTENDEE" | "ORGANIZER" | "ADMIN";

export interface OrganizerSummary {
  id: number;
  name: string;
  avatarUrl?: string | null;
  city?: string | null;
}

export interface AuthUser {
  id: number;
  email: string;
  role: UserRole;
  organizer?: OrganizerSummary | null;
}

export interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}

export interface RegisterInput {
  email: string;
  password: string;
  role?: "ATTENDEE" | "ORGANIZER";
  name?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}
