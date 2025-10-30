import type { Genre } from "@/entity/genre/genre";

export interface GenreRepository {
  getAll(): Promise<Genre[]>;
  getById(id: number): Promise<Genre>;
  create(genre: Partial<Genre>): Promise<Genre>;
  update(id: number, genre: Partial<Genre>): Promise<Genre>;
  delete(id: number): Promise<Genre>;
}
