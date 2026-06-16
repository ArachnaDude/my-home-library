import { FormEvent, useCallback, useEffect, useState } from "react";
import { Book, createBook, deleteBook, getBooks } from "./api";
import "./App.css";

function App() {
  const [books, setBooks] = useState<Book[]>([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const loadBooks = useCallback(async () => {
    setError(null);
    try {
      setBooks(await getBooks());
    } catch {
      setError("Could not load books. Is the API running?");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;

    setSubmitting(true);
    setError(null);
    try {
      await createBook(trimmed);
      setTitle("");
      await loadBooks();
    } catch {
      setError("Could not add book.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    setError(null);
    try {
      await deleteBook(id);
      await loadBooks();
    } catch {
      setError("Could not delete book.");
    }
  }

  return (
    <main className="app">
      <header>
        <h1>Home Library</h1>
        <p>Your personal book collection</p>
      </header>

      <form className="add-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Book title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={submitting}
        />
        <button type="submit" disabled={submitting || !title.trim()}>
          {submitting ? "Adding…" : "Add book"}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      <section className="books">
        <h2>Books ({books.length})</h2>
        {loading ? (
          <p>Loading…</p>
        ) : books.length === 0 ? (
          <p className="empty">No books yet. Add one above.</p>
        ) : (
          <ul>
            {books.map((book) => (
              <li key={book.id}>
                <span>{book.title}</span>
                <button
                  type="button"
                  className="delete"
                  onClick={() => handleDelete(book.id)}
                  aria-label={`Delete ${book.title}`}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

export default App;
