import uuid

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.book import Book, BookCreate
from app.services import book as book_service

router = APIRouter(prefix="/books", tags=["books"])


@router.get("", response_model=list[Book])
def get_books(title: str | None = None, db: Session = Depends(get_db)):
    return book_service.list_books(db, title=title)


@router.post("/create", response_model=Book, status_code=status.HTTP_201_CREATED)
def create_book(body: BookCreate, db: Session = Depends(get_db)):
    return book_service.create_book(db, body)


@router.delete("/{book_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_book(book_id: uuid.UUID, db: Session = Depends(get_db)):
    book_service.delete_book(db, book_id)
