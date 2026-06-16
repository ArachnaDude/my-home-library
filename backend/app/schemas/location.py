import uuid

from pydantic import BaseModel


class LocationCreate(BaseModel):
    name: str
    description: str | None = None


class Location(BaseModel):
    id: uuid.UUID
    name: str
    description: str | None
    parent_id: uuid.UUID | None
