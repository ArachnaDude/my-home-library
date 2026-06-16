import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import { bookRepo, locationRepo } from "../repos";
import type { BookDetail } from "../types/book";
import type { Location } from "../types/location";
import "../components/AddBookForm.css";
import "./BookDetailPage.css";
import "./page.css";

function bookToFormState(book: BookDetail) {
  return {
    title: book.title,
    subtitle: book.subtitle ?? "",
    locationId: book.location?.id ?? "",
    isbn: book.isbn ?? "",
    publicationYear:
      book.publication_year != null ? String(book.publication_year) : "",
    format: book.format ?? "",
    notes: book.notes ?? "",
  };
}

export function BookDetailPage() {
  const { bookId } = useParams<{ bookId: string }>();
  const [book, setBook] = useState<BookDetail | null>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [locationId, setLocationId] = useState("");
  const [isbn, setIsbn] = useState("");
  const [publicationYear, setPublicationYear] = useState("");
  const [format, setFormat] = useState("");
  const [notes, setNotes] = useState("");

  const loadBook = useCallback(async () => {
    if (!bookId) return;

    setLoading(true);
    setError(null);

    try {
      const data = await bookRepo.getById(bookId);
      setBook(data);
    } catch {
      setError("Could not load book.");
    } finally {
      setLoading(false);
    }
  }, [bookId]);

  useEffect(() => {
    loadBook();
  }, [loadBook]);

  useEffect(() => {
    if (!editing) return;

    let cancelled = false;
    locationRepo
      .getAll()
      .then((data) => {
        if (!cancelled) setLocations(data);
      })
      .catch(() => {
        if (!cancelled) setSaveError("Could not load locations.");
      });

    return () => {
      cancelled = true;
    };
  }, [editing]);

  function startEditing() {
    if (!book) return;
    const form = bookToFormState(book);
    setTitle(form.title);
    setSubtitle(form.subtitle);
    setLocationId(form.locationId);
    setIsbn(form.isbn);
    setPublicationYear(form.publicationYear);
    setFormat(form.format);
    setNotes(form.notes);
    setSaveError(null);
    setEditing(true);
  }

  function cancelEditing() {
    setEditing(false);
    setSaveError(null);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!bookId) return;

    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    setSubmitting(true);
    setSaveError(null);

    try {
      const updated = await bookRepo.update(bookId, {
        title: trimmedTitle,
        subtitle: subtitle.trim() || null,
        isbn: isbn.trim() || null,
        publication_year: publicationYear ? Number(publicationYear) : null,
        format: format.trim() || null,
        notes: notes.trim() || null,
        location_id: locationId || null,
      });
      setBook(updated);
      setEditing(false);
    } catch {
      setSaveError("Could not save changes.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <main className="page book-detail">
        <p className="empty">Loading…</p>
      </main>
    );
  }

  if (error || !book) {
    return (
      <main className="page book-detail">
        <p className="error">{error ?? "Book not found."}</p>
        <Link to="/books" className="book-detail__back">
          ← Back to search
        </Link>
      </main>
    );
  }

  return (
    <main className="page book-detail">
      <div className="book-detail__toolbar">
        <Link to="/books" className="book-detail__back">
          ← Back to search
        </Link>
        {!editing && (
          <button
            type="button"
            className="book-detail__edit"
            onClick={startEditing}
          >
            Edit
          </button>
        )}
      </div>

      {editing ? (
        <form className="book-form book-detail__form" onSubmit={handleSubmit}>
          <h1 className="book-detail__form-title">Edit book</h1>

          <label className="book-form__field">
            <span>Title *</span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={submitting}
              autoFocus
              required
            />
          </label>

          <label className="book-form__field">
            <span>Subtitle</span>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              disabled={submitting}
            />
          </label>

          <label className="book-form__field">
            <span>Location</span>
            <select
              value={locationId}
              onChange={(e) => setLocationId(e.target.value)}
              disabled={submitting}
            >
              <option value="">None</option>
              {locations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </select>
          </label>

          <div className="book-form__row">
            <label className="book-form__field">
              <span>ISBN</span>
              <input
                type="text"
                value={isbn}
                onChange={(e) => setIsbn(e.target.value)}
                disabled={submitting}
              />
            </label>
            <label className="book-form__field">
              <span>Year</span>
              <input
                type="number"
                value={publicationYear}
                onChange={(e) => setPublicationYear(e.target.value)}
                disabled={submitting}
                min={0}
                max={9999}
              />
            </label>
          </div>

          <label className="book-form__field">
            <span>Format</span>
            <input
              type="text"
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              disabled={submitting}
              placeholder="Hardcover, paperback, ebook…"
            />
          </label>

          <label className="book-form__field">
            <span>Notes</span>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={submitting}
              rows={3}
            />
          </label>

          {saveError && <p className="error">{saveError}</p>}

          <div className="book-form__actions">
            <button
              type="button"
              className="book-form__cancel"
              onClick={cancelEditing}
              disabled={submitting}
            >
              Cancel
            </button>
            <button type="submit" disabled={submitting || !title.trim()}>
              {submitting ? "Saving…" : "Save changes"}
            </button>
          </div>
        </form>
      ) : (
        <>
          <header className="book-detail__header">
            <h1>{book.title}</h1>
            {book.subtitle && (
              <p className="book-detail__subtitle">{book.subtitle}</p>
            )}
          </header>

          <dl className="book-detail__meta">
            {book.authors.length > 0 && (
              <>
                <dt>Author{book.authors.length > 1 ? "s" : ""}</dt>
                <dd>{book.authors.map((a) => a.display_name).join(", ")}</dd>
              </>
            )}

            <dt>Location</dt>
            <dd>
              {book.location ? (
                <>
                  {book.location.name}
                  {book.location.description && (
                    <span className="book-detail__location-desc">
                      {" "}
                      — {book.location.description}
                    </span>
                  )}
                </>
              ) : (
                <span className="book-detail__unset">Not set</span>
              )}
            </dd>

            {book.isbn && (
              <>
                <dt>ISBN</dt>
                <dd>{book.isbn}</dd>
              </>
            )}

            {book.publication_year != null && (
              <>
                <dt>Published</dt>
                <dd>{book.publication_year}</dd>
              </>
            )}

            {book.format && (
              <>
                <dt>Format</dt>
                <dd>{book.format}</dd>
              </>
            )}

            {book.notes && (
              <>
                <dt>Notes</dt>
                <dd>{book.notes}</dd>
              </>
            )}
          </dl>
        </>
      )}
    </main>
  );
}
