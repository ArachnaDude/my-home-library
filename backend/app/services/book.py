import uuid

from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models.author import Author as AuthorModel
from app.models.book import Book as BookModel
from app.models.book_author import BookAuthor
from app.models.location import Location as LocationModel
from app.schemas.book import (
    AuthorSummary,
    Book,
    BookCreate,
    BookDetail,
    BookUpdate,
    LocationSummary,
)


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


def _raise_book_integrity_error(exc: IntegrityError, *, action: str) -> None:
    pgcode = getattr(exc.orig, "pgcode", None)
    if pgcode == "23505":
        raise HTTPException(status_code=409, detail="ISBN already exists") from exc
    if pgcode == "23503":
        raise HTTPException(status_code=404, detail="Location not found") from exc
    raise HTTPException(status_code=400, detail=f"Could not {action} book") from exc


def list_books(
    db: Session,
    title: str | None = None,
    author_id: uuid.UUID | None = None,
) -> list[Book]:
    stmt = select(BookModel).order_by(BookModel.title)
    if title and title.strip():
        pattern = f"%{_escape_ilike(title.strip())}%"
        stmt = stmt.where(BookModel.title.ilike(pattern, escape="\\"))
    if author_id is not None:
        stmt = stmt.join(
            BookAuthor, BookAuthor.book_id == BookModel.id
        ).where(BookAuthor.author_id == author_id)
    rows = db.scalars(stmt).all()
    return [_to_book(row) for row in rows]


def get_book(db: Session, book_id: uuid.UUID) -> BookDetail:
    book = db.get(BookModel, book_id)
    if book is None:
        raise HTTPException(status_code=404, detail="Book not found")

    authors = db.scalars(
        select(AuthorModel)
        .join(BookAuthor, BookAuthor.author_id == AuthorModel.id)
        .where(BookAuthor.book_id == book_id)
        .order_by(BookAuthor.sort_order, AuthorModel.display_name)
    ).all()

    location = None
    if book.location_id is not None:
        loc = db.get(LocationModel, book.location_id)
        if loc is not None:
            location = LocationSummary(
                id=loc.id,
                name=loc.name,
                description=loc.description,
            )

    return BookDetail(
        **_to_book(book).model_dump(),
        authors=[AuthorSummary(id=a.id, display_name=a.display_name) for a in authors],
        location=location,
    )


def create_book(db: Session, data: BookCreate) -> Book:
    payload = data.model_dump(exclude={"author_id"})
    author_id = data.author_id

    if data.location_id is not None and db.get(LocationModel, data.location_id) is None:
        raise HTTPException(status_code=404, detail="Location not found")
    if author_id is not None and db.get(AuthorModel, author_id) is None:
        raise HTTPException(status_code=404, detail="Author not found")

    book = BookModel(**payload)
    db.add(book)
    try:
        db.flush()
        if author_id is not None:
            db.add(BookAuthor(book_id=book.id, author_id=author_id))
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        _raise_book_integrity_error(exc, action="create")
    db.refresh(book)
    return _to_book(book)


def update_book(db: Session, book_id: uuid.UUID, data: BookUpdate) -> BookDetail:
    book = db.get(BookModel, book_id)
    if book is None:
        raise HTTPException(status_code=404, detail="Book not found")

    if data.location_id is not None and db.get(LocationModel, data.location_id) is None:
        raise HTTPException(status_code=404, detail="Location not found")

    for field, value in data.model_dump().items():
        setattr(book, field, value)

    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        _raise_book_integrity_error(exc, action="update")
    db.refresh(book)
    return get_book(db, book_id)


def delete_book(db: Session, book_id: uuid.UUID) -> None:
    book = db.get(BookModel, book_id)
    if book is None:
        raise HTTPException(status_code=404, detail="Book not found")
    db.delete(book)
    db.commit()
