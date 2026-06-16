import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { authorRepo, bookRepo } from "../repos";
import type { Author } from "../types/author";
import type { Book } from "../types/book";
import "./AuthorDetailPage.css";
import "./BooksPage.css";
import "./page.css";

export function AuthorDetailPage() {
  const { authorId } = useParams<{ authorId: string }>();
  const [author, setAuthor] = useState<Author | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authorId) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    Promise.all([authorRepo.getById(authorId), bookRepo.listByAuthor(authorId)])
      .then(([authorData, bookList]) => {
        if (!cancelled) {
          setAuthor(authorData);
          setBooks(bookList);
        }
      })
      .catch(() => {
        if (!cancelled) setError("Could not load author.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [authorId]);

  if (loading) {
    return (
      <main className="page author-detail">
        <p className="empty">Loading…</p>
      </main>
    );
  }

  if (error || !author) {
    return (
      <main className="page author-detail">
        <p className="error">{error ?? "Author not found."}</p>
        <Link to="/authors" className="author-detail__back">
          ← Back to authors
        </Link>
      </main>
    );
  }

  return (
    <main className="page author-detail">
      <Link to="/authors" className="author-detail__back">
        ← Back to authors
      </Link>

      <header className="page__header author-detail__header">
        <h1>{author.display_name}</h1>
        <p>
          {books.length} {books.length === 1 ? "book" : "books"} in your library
        </p>
      </header>

      <section className="books-results" aria-live="polite">
        {books.length === 0 ? (
          <p className="empty">No books by this author in your library yet.</p>
        ) : (
          <ul className="books-results__list">
            {books.map((book) => (
              <li key={book.id}>
                <Link to={`/books/${book.id}`} className="books-results__item">
                  <span className="books-results__title">{book.title}</span>
                  {book.subtitle && (
                    <span className="books-results__subtitle">{book.subtitle}</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
