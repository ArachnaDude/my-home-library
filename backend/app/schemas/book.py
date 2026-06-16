import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict


class Book(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    title: str
    subtitle: str | None
    isbn: str | None
    publication_year: int | None
    format: str | None
    notes: str | None
    location_id: uuid.UUID | None
    created_at: datetime
    updated_at: datetime
