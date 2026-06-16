import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AddBookForm } from "../components/AddBookForm";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { bookRepo } from "../repos";
import type { Book } from "../types/book";
import "./BooksPage.css";

const SEARCH_DEBOUNCE_MS = 300;

export function BooksPage() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, SEARCH_DEBOUNCE_MS);
  const [results, setResults] = useState<Book[]>([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const trimmedQuery = debouncedQuery.trim();
  const hasQuery = trimmedQuery.length > 0;

  useEffect(() => {
    if (!hasQuery) {
      setResults([]);
      setSearching(false);
      setError(null);
      return;
    }

    let cancelled = false;
    setSearching(true);
    setError(null);

    bookRepo
      .search(trimmedQuery)
      .then((books) => {
        if (!cancelled) setResults(books);
      })
      .catch(() => {
        if (!cancelled) {
          setError("Could not search books. Is the API running?");
          setResults([]);
        }
      })
      .finally(() => {
        if (!cancelled) setSearching(false);
      });

    return () => {
      cancelled = true;
    };
  }, [trimmedQuery, hasQuery]);

  return (
    <main className="page books-page">
      <header className="page__header books-page__header">
        <div>
          <h1>Books</h1>
          <p>Search your library to find a book.</p>
        </div>
        <button
          type="button"
          className="books-page__add"
          onClick={() => setShowAddForm(true)}
        >
          Add book
        </button>
      </header>

      <div className="books-search">
        <input
          type="search"
          className="books-search__input"
          placeholder="Search by title…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search books by title"
        />
      </div>

      {error && <p className="error">{error}</p>}

      <section className="books-results" aria-live="polite">
        {!hasQuery ? (
          <p className="empty books-results__hint">
            Enter a title to check if it&apos;s in your library.
          </p>
        ) : searching ? (
          <p className="empty">Searching…</p>
        ) : results.length === 0 ? (
          <p className="empty">No books match &ldquo;{trimmedQuery}&rdquo;.</p>
        ) : (
          <>
            <p className="books-results__count">
              {results.length} {results.length === 1 ? "match" : "matches"}
            </p>
            <ul className="books-results__list">
              {results.map((book) => (
                <li key={book.id}>
                  <Link to={`/books/${book.id}`} className="books-results__item">
                    <span className="books-results__title">{book.title}</span>
                    {book.subtitle && (
                      <span className="books-results__subtitle">
                        {book.subtitle}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>

      {showAddForm && (
        <AddBookForm
          onClose={() => setShowAddForm(false)}
          onCreated={() => {
            if (hasQuery) {
              bookRepo.search(trimmedQuery).then(setResults).catch(() => {});
            }
          }}
        />
      )}
    </main>
  );
}
