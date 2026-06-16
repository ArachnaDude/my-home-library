import uuid

from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models.book import Book as BookModel
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


def list_books(db: Session) -> list[Book]:
    rows = db.scalars(select(BookModel).order_by(BookModel.title)).all()
    return [_to_book(row) for row in rows]


def create_book(db: Session, data: BookCreate) -> Book:
    book = BookModel(**data.model_dump())
    db.add(book)
    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(status_code=409, detail="ISBN already exists") from exc
    db.refresh(book)
    return _to_book(book)


def delete_book(db: Session, book_id: uuid.UUID) -> None:
    book = db.get(BookModel, book_id)
    if book is None:
        raise HTTPException(status_code=404, detail="Book not found")
    db.delete(book)
    db.commit()
