-- Home library schema (PostgreSQL)
-- Run: psql -d your_database -f db_setup.sql
-- Requires PostgreSQL 13+ (gen_random_uuid)

DROP TABLE IF EXISTS book_authors;
DROP TABLE IF EXISTS books;
DROP TABLE IF EXISTS authors;
DROP TABLE IF EXISTS locations;

CREATE TABLE authors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name TEXT,
    last_name TEXT,
    display_name TEXT NOT NULL
);

CREATE TABLE locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    parent_id UUID REFERENCES locations (id) ON DELETE SET NULL
);

CREATE TABLE books (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    subtitle TEXT,
    isbn TEXT,
    publication_year INTEGER,
    format TEXT,
    notes TEXT,
    location_id UUID REFERENCES locations (id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX books_isbn_unique ON books (isbn) WHERE isbn IS NOT NULL;

CREATE TABLE book_authors (
    book_id UUID NOT NULL REFERENCES books (id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES authors (id) ON DELETE CASCADE,
    sort_order INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (book_id, author_id)
);

CREATE INDEX idx_books_title ON books (title);
CREATE INDEX idx_books_location_id ON books (location_id);
CREATE INDEX idx_authors_display_name ON authors (display_name);
