import { apiRequest } from "../api/client";
import type { Author, AuthorCreate } from "../types/author";

export const authorRepo = {
  getAll(): Promise<Author[]> {
    return apiRequest<Author[]>("/authors");
  },

  getById(id: string): Promise<Author> {
    return apiRequest<Author>(`/authors/${id}`);
  },

  create(data: AuthorCreate): Promise<Author> {
    return apiRequest<Author>("/authors/create", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};
