import uuid

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.book import Book, BookCreate, BookDetail, BookUpdate
from app.services import book as book_service

router = APIRouter(prefix="/books", tags=["books"])


@router.get("", response_model=list[Book])
def get_books(
    title: str | None = None,
    author_id: uuid.UUID | None = None,
    db: Session = Depends(get_db),
):
    return book_service.list_books(db, title=title, author_id=author_id)


@router.get("/{book_id}", response_model=BookDetail)
def get_book(book_id: uuid.UUID, db: Session = Depends(get_db)):
    return book_service.get_book(db, book_id)


@router.post("/create", response_model=Book, status_code=status.HTTP_201_CREATED)
def create_book(body: BookCreate, db: Session = Depends(get_db)):
    return book_service.create_book(db, body)


@router.patch("/{book_id}", response_model=BookDetail)
def update_book(
    book_id: uuid.UUID, body: BookUpdate, db: Session = Depends(get_db)
):
    return book_service.update_book(db, book_id, body)


@router.delete("/{book_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_book(book_id: uuid.UUID, db: Session = Depends(get_db)):
    book_service.delete_book(db, book_id)
