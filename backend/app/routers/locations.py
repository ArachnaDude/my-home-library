from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.location import Location, LocationCreate
from app.services import location as location_service

router = APIRouter(prefix="/locations", tags=["locations"])


@router.get("", response_model=list[Location])
def get_locations(db: Session = Depends(get_db)):
    return location_service.list_locations(db)


@router.post("/create", response_model=Location, status_code=status.HTTP_201_CREATED)
def create_location(body: LocationCreate, db: Session = Depends(get_db)):
    return location_service.create_location(db, body)
