import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { authorRepo } from "../repos";
import type { Author } from "../types/author";
import "./AuthorsPage.css";
import "./page.css";

export function AuthorsPage() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAuthors = useCallback(async () => {
    setError(null);
    try {
      setAuthors(await authorRepo.getAll());
    } catch {
      setError("Could not load authors. Is the API running?");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAuthors();
  }, [loadAuthors]);

  return (
    <main className="page authors-page">
      <header className="page__header">
        <h1>Authors</h1>
        <p>Browse the authors in your library.</p>
      </header>

      {error && <p className="error">{error}</p>}

      <section className="authors-list">
        <h2>All authors ({authors.length})</h2>
        {loading ? (
          <p>Loading…</p>
        ) : authors.length === 0 ? (
          <p className="empty">No authors yet. Authors are added when you add a book.</p>
        ) : (
          <ul>
            {authors.map((author) => (
              <li key={author.id}>
                <Link to={`/authors/${author.id}`} className="authors-list__link">
                  {author.display_name}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
