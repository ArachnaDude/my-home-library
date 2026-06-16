import uuid

from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models.book import Book as BookModel
from app.models.location import Location as LocationModel
from app.schemas.book import Book, BookCreate


def _to_book(row: BookModel) -> Book:
    return Book(
        id=row.id,
        title=row.title,
        subtitle=row.subtitle,
        isbn=row.isbn,
        publication_year=row.publication_year,
        format=row.format,
        notes=row.notes,
        location_id=row.location_id,
        created_at=row.created_at,
        updated_at=row.updated_at,
    )


def _escape_ilike(value: str) -> str:
    return value.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_")


def _raise_create_book_error(exc: IntegrityError) -> None:
    pgcode = getattr(exc.orig, "pgcode", None)
    if pgcode == "23505":
        raise HTTPException(status_code=409, detail="ISBN already exists") from exc
    if pgcode == "23503":
        raise HTTPException(status_code=404, detail="Location not found") from exc
    raise HTTPException(status_code=400, detail="Could not create book") from exc


def list_books(db: Session, title: str | None = None) -> list[Book]:
    stmt = select(BookModel).order_by(BookModel.title)
    if title and title.strip():
        pattern = f"%{_escape_ilike(title.strip())}%"
        stmt = stmt.where(BookModel.title.ilike(pattern, escape="\\"))
    rows = db.scalars(stmt).all()
    return [_to_book(row) for row in rows]


def create_book(db: Session, data: BookCreate) -> Book:
    if data.location_id is not None and db.get(LocationModel, data.location_id) is None:
        raise HTTPException(status_code=404, detail="Location not found")
    book = BookModel(**data.model_dump())
    db.add(book)
    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        _raise_create_book_error(exc)
    db.refresh(book)
    return _to_book(book)


def delete_book(db: Session, book_id: uuid.UUID) -> None:
    book = db.get(BookModel, book_id)
    if book is None:
        raise HTTPException(status_code=404, detail="Book not found")
    db.delete(book)
    db.commit()
