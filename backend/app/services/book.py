from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.book import Book


def list_books(db: Session) -> list[Book]:
    return list(db.scalars(select(Book).order_by(Book.title)).all())
