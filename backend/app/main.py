from fastapi import FastAPI

from app.routers import books, health

app = FastAPI(title="Home Library API")

app.include_router(health.router)
app.include_router(books.router)
