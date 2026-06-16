const API = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export interface Book {
  id: string;
  title: string;
  subtitle: string | null;
  isbn: string | null;
  publication_year: number | null;
  format: string | null;
  notes: string | null;
  location_id: string | null;
  created_at: string;
  updated_at: string;
}

export async function getBooks(): Promise<Book[]> {
  const res = await fetch(`${API}/books`);
  if (!res.ok) throw new Error("Failed to fetch books");
  return res.json();
}

export async function createBook(title: string): Promise<Book> {
  const res = await fetch(`${API}/books/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });
  if (!res.ok) throw new Error("Failed to create book");
  return res.json();
}

export async function deleteBook(id: string): Promise<void> {
  const res = await fetch(`${API}/books/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete book");
}
