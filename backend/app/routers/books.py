from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.book import Book
from app.services import book as book_service

router = APIRouter(prefix="/books", tags=["books"])


@router.get("", response_model=list[Book])
def get_books(db: Session = Depends(get_db)):
    return book_service.list_books(db)
