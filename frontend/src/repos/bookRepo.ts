import { apiRequest } from "../api/client";
import type { Book, BookCreate, BookDetail, BookUpdate } from "../types/book";

export const bookRepo = {
  search(title: string): Promise<Book[]> {
    const query = `?title=${encodeURIComponent(title)}`;
    return apiRequest<Book[]>(`/books${query}`);
  },

  listByAuthor(authorId: string): Promise<Book[]> {
    const query = `?author_id=${encodeURIComponent(authorId)}`;
    return apiRequest<Book[]>(`/books${query}`);
  },

  getById(id: string): Promise<BookDetail> {
    return apiRequest<BookDetail>(`/books/${id}`);
  },

  create(data: BookCreate): Promise<Book> {
    return apiRequest<Book>("/books/create", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update(id: string, data: BookUpdate): Promise<BookDetail> {
    return apiRequest<BookDetail>(`/books/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  delete(id: string): Promise<void> {
    return apiRequest<void>(`/books/${id}`, { method: "DELETE" });
  },
};
