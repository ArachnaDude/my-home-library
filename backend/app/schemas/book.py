import uuid
from datetime import datetime

from pydantic import BaseModel


class BookCreate(BaseModel):
    title: str
    subtitle: str | None = None
    isbn: str | None = None
    publication_year: int | None = None
    format: str | None = None
    notes: str | None = None
    location_id: uuid.UUID | None = None
    author_id: uuid.UUID | None = None


class BookUpdate(BaseModel):
    title: str
    subtitle: str | None = None
    isbn: str | None = None
    publication_year: int | None = None
    format: str | None = None
    notes: str | None = None
    location_id: uuid.UUID | None = None


class Book(BaseModel):
    id: uuid.UUID
    title: str
    subtitle: str | None
    isbn: str | None
    publication_year: int | None
    format: str | None
    notes: str | None
    location_id: uuid.UUID | None
    created_at: datetime
    updated_at: datetime


class AuthorSummary(BaseModel):
    id: uuid.UUID
    display_name: str


class LocationSummary(BaseModel):
    id: uuid.UUID
    name: str
    description: str | None


class BookDetail(Book):
    authors: list[AuthorSummary] = []
    location: LocationSummary | None = None
