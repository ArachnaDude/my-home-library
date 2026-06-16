import uuid

from pydantic import BaseModel


class AuthorCreate(BaseModel):
    display_name: str
    first_name: str | None = None
    last_name: str | None = None


class Author(BaseModel):
    id: uuid.UUID
    display_name: str
    first_name: str | None
    last_name: str | None
