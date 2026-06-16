import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { locationRepo } from "../repos";
import type { Location } from "../types/location";
import "./LandingPage.css";

const sections = [
  {
    to: "/books",
    title: "Books",
    description: "Browse and manage your collection.",
  },
  {
    to: "/authors",
    title: "Authors",
    description: "Keep track of who wrote what.",
  },
  {
    to: "/locations",
    title: "Locations",
    description: "Know where each book lives on your shelves.",
  },
] as const;

export function LandingPage() {
  const [locations, setLocations] = useState<Location[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadLocations = useCallback(async () => {
    setError(null);
    try {
      setLocations(await locationRepo.getAll());
    } catch {
      setError("Could not load locations. Is the API running?");
      setLocations([]);
    }
  }, []);

  useEffect(() => {
    loadLocations();
  }, [loadLocations]);

  if (locations === null) {
    return (
      <main className="landing">
        <p className="landing__status">Loading…</p>
      </main>
    );
  }

  if (locations.length === 0) {
    return (
      <main className="landing">
        <SetupPrompt error={error} onCreated={loadLocations} />
      </main>
    );
  }

  return (
    <main className="landing">
      <header className="landing__hero">
        <p className="landing__eyebrow">Personal library</p>
        <h1>My Home Library</h1>
        <p className="landing__subtitle">
          Catalog your books, authors, and shelf locations in one place.
        </p>
      </header>

      <section className="landing__sections" aria-label="Quick links">
        <h2>Get started</h2>
        <ul className="landing__cards">
          {sections.map(({ to, title, description }) => (
            <li key={to}>
              <Link to={to} className="landing__card">
                <span className="landing__card-title">{title}</span>
                <span className="landing__card-desc">{description}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

function SetupPrompt({
  error,
  onCreated,
}: {
  error: string | null;
  onCreated: () => Promise<void>;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;

    setSubmitting(true);
    setSubmitError(null);
    try {
      await locationRepo.create({
        name: trimmed,
        description: description.trim() || null,
      });
      setName("");
      setDescription("");
      await onCreated();
    } catch {
      setSubmitError("Could not create location.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="landing__setup" aria-labelledby="setup-heading">
      <p className="landing__eyebrow">First step</p>
      <h1 id="setup-heading">Add a location</h1>
      <p className="landing__subtitle">
        Before you can catalog books, tell us where they live — a room, shelf,
        or bookcase works great.
      </p>

      <form className="landing__setup-form" onSubmit={handleSubmit}>
        <label className="landing__field">
          <span>Name</span>
          <input
            type="text"
            placeholder="e.g. Living room bookshelf"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={submitting}
            autoFocus
          />
        </label>
        <label className="landing__field">
          <span>Description (optional)</span>
          <input
            type="text"
            placeholder="Top shelf, left side"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={submitting}
          />
        </label>
        <button type="submit" disabled={submitting || !name.trim()}>
          {submitting ? "Saving…" : "Add location"}
        </button>
      </form>

      {(submitError || error) && (
        <p className="landing__error">{submitError ?? error}</p>
      )}
    </section>
  );
}
