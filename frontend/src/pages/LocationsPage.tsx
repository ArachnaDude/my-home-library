import { useCallback, useEffect, useState, type FormEvent } from "react";
import { locationRepo } from "../repos";
import type { Location } from "../types/location";
import "./LocationsPage.css";
import "./page.css";

export function LocationsPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const loadLocations = useCallback(async () => {
    setError(null);
    try {
      setLocations(await locationRepo.getAll());
    } catch {
      setError("Could not load locations. Is the API running?");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLocations();
  }, [loadLocations]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;

    setSubmitting(true);
    setError(null);
    try {
      await locationRepo.create({
        name: trimmed,
        description: description.trim() || null,
      });
      setName("");
      setDescription("");
      await loadLocations();
    } catch {
      setError("Could not add location.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="page locations-page">
      <header className="page__header">
        <h1>Locations</h1>
        <p>Track where books are shelved in your home.</p>
      </header>

      <form className="add-form add-form--stacked" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Location name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={submitting}
        />
        <input
          type="text"
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={submitting}
        />
        <button type="submit" disabled={submitting || !name.trim()}>
          {submitting ? "Adding…" : "Add location"}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      <section className="locations-list">
        <h2>All locations ({locations.length})</h2>
        {loading ? (
          <p>Loading…</p>
        ) : locations.length === 0 ? (
          <p className="empty">No locations yet. Add one above.</p>
        ) : (
          <ul>
            {locations.map((location) => (
              <li key={location.id}>
                <span className="locations-list__name">{location.name}</span>
                {location.description && (
                  <span className="locations-list__desc">
                    {location.description}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
