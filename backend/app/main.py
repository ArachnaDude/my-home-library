from fastapi import FastAPI

from app.routers import authors, books, health, locations

app = FastAPI(title="Home Library API")

app.include_router(health.router)
app.include_router(authors.router)
app.include_router(books.router)
app.include_router(locations.router)
