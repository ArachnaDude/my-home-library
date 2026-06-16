import { useCallback, useEffect, useState, type FormEvent } from "react";
import { authorRepo, bookRepo, locationRepo } from "../repos";
import type { Author } from "../types/author";
import type { Location } from "../types/location";
import "./AddBookForm.css";

const NEW_AUTHOR = "__new__";

interface AddBookFormProps {
  onClose: () => void;
  onCreated: () => void;
}

export function AddBookForm({ onClose, onCreated }: AddBookFormProps) {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [authorSelection, setAuthorSelection] = useState("");
  const [newAuthorName, setNewAuthorName] = useState("");
  const [locationId, setLocationId] = useState("");
  const [isbn, setIsbn] = useState("");
  const [publicationYear, setPublicationYear] = useState("");
  const [format, setFormat] = useState("");
  const [notes, setNotes] = useState("");

  const loadOptions = useCallback(async () => {
    setLoadingOptions(true);
    setError(null);
    try {
      const [authorList, locationList] = await Promise.all([
        authorRepo.getAll(),
        locationRepo.getAll(),
      ]);
      setAuthors(authorList);
      setLocations(locationList);
    } catch {
      setError("Could not load authors or locations.");
    } finally {
      setLoadingOptions(false);
    }
  }, []);

  useEffect(() => {
    loadOptions();
  }, [loadOptions]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    setSubmitting(true);
    setError(null);

    try {
      let authorId: string | null = null;
      if (authorSelection === NEW_AUTHOR) {
        const name = newAuthorName.trim();
        if (name) {
          const author = await authorRepo.create({ display_name: name });
          authorId = author.id;
        }
      } else if (authorSelection) {
        authorId = authorSelection;
      }

      await bookRepo.create({
        title: trimmedTitle,
        subtitle: subtitle.trim() || null,
        isbn: isbn.trim() || null,
        publication_year: publicationYear ? Number(publicationYear) : null,
        format: format.trim() || null,
        notes: notes.trim() || null,
        location_id: locationId || null,
        author_id: authorId,
      });

      onCreated();
      onClose();
    } catch {
      setError("Could not add book.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-book-title"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="modal__header">
          <h2 id="add-book-title">Add book</h2>
          <button
            type="button"
            className="modal__close"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </header>

        {loadingOptions ? (
          <p className="modal__status">Loading…</p>
        ) : (
          <form className="book-form" onSubmit={handleSubmit}>
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
              <span>Author</span>
              <select
                value={authorSelection}
                onChange={(e) => setAuthorSelection(e.target.value)}
                disabled={submitting}
              >
                <option value="">None</option>
                {authors.map((author) => (
                  <option key={author.id} value={author.id}>
                    {author.display_name}
                  </option>
                ))}
                <option value={NEW_AUTHOR}>Add new author…</option>
              </select>
            </label>

            {authorSelection === NEW_AUTHOR && (
              <label className="book-form__field">
                <span>New author name</span>
                <input
                  type="text"
                  value={newAuthorName}
                  onChange={(e) => setNewAuthorName(e.target.value)}
                  disabled={submitting}
                  placeholder="Author display name"
                />
              </label>
            )}

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

            {error && <p className="error">{error}</p>}

            <div className="book-form__actions">
              <button
                type="button"
                className="book-form__cancel"
                onClick={onClose}
                disabled={submitting}
              >
                Cancel
              </button>
              <button type="submit" disabled={submitting || !title.trim()}>
                {submitting ? "Saving…" : "Add book"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
