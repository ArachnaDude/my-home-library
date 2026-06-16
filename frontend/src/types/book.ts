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

export interface BookCreate {
  title: string;
  subtitle?: string | null;
  isbn?: string | null;
  publication_year?: number | null;
  format?: string | null;
  notes?: string | null;
  location_id?: string | null;
  author_id?: string | null;
}

export interface BookUpdate {
  title: string;
  subtitle?: string | null;
  isbn?: string | null;
  publication_year?: number | null;
  format?: string | null;
  notes?: string | null;
  location_id?: string | null;
}

export interface AuthorSummary {
  id: string;
  display_name: string;
}

export interface LocationSummary {
  id: string;
  name: string;
  description: string | null;
}

export interface BookDetail extends Book {
  authors: AuthorSummary[];
  location: LocationSummary | null;
}
