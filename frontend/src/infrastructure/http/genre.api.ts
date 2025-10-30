import { httpClient } from './httpClient'
import type { Genre } from '@/entity/genre/genre'
import type { GenreRepository } from '@/entity/genre/genre.repo'

export const genreApi: GenreRepository = {
  async getAll() {
    const { data } = await httpClient.get<Genre[]>('/genres')
    return data
  },

  async getById(id: number) {
    const { data } = await httpClient.get<Genre>(`/genres/${id}`)
    return data
  },

  async create(genre: Genre) {
    const { data } = await httpClient.post<Genre>('/genres', genre)
    return data
  },

  async update(id: number, genre: Genre) {
    const { data } = await httpClient.put<Genre>(`/genres/${id}`, genre)
    return data
  },

  async delete(id: number) {
    const { data } = await httpClient.delete<Genre>(`/genres/${id}`)
    return data
  },
}
