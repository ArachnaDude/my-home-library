from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.author import Author, AuthorCreate
from app.services import author as author_service

router = APIRouter(prefix="/authors", tags=["authors"])


@router.get("", response_model=list[Author])
def get_authors(db: Session = Depends(get_db)):
    return author_service.list_authors(db)


@router.post("/create", response_model=Author, status_code=status.HTTP_201_CREATED)
def create_author(body: AuthorCreate, db: Session = Depends(get_db)):
    return author_service.create_author(db, body)
