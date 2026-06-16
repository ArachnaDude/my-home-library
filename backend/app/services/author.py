from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.author import Author as AuthorModel
from app.schemas.author import Author, AuthorCreate


def _to_author(row: AuthorModel) -> Author:
    return Author(
        id=row.id,
        display_name=row.display_name,
        first_name=row.first_name,
        last_name=row.last_name,
    )


def list_authors(db: Session) -> list[Author]:
    rows = db.scalars(select(AuthorModel).order_by(AuthorModel.display_name)).all()
    return [_to_author(row) for row in rows]


def create_author(db: Session, data: AuthorCreate) -> Author:
    author = AuthorModel(**data.model_dump())
    db.add(author)
    db.commit()
    db.refresh(author)
    return _to_author(author)
