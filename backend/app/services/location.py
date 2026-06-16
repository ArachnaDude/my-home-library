from sqlalchemy.orm import Session

from app.models.location import Location as LocationModel
from app.schemas.location import Location, LocationCreate


def _to_location(row: LocationModel) -> Location:
    return Location(
        id=row.id,
        name=row.name,
        description=row.description,
        parent_id=row.parent_id,
    )


def create_location(db: Session, data: LocationCreate) -> Location:
    location = LocationModel(**data.model_dump())
    db.add(location)
    db.commit()
    db.refresh(location)
    return _to_location(location)
