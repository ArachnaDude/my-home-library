# my-home-library

Personal home library API (FastAPI + PostgreSQL).

## Quick start (demo / new machine)

**Prerequisites:** [Docker Desktop](https://www.docker.com/products/docker-desktop/), Python 3.13+

```bash
git clone https://github.com/YOUR_USER/my-home-library.git
cd my-home-library

# 1. Start Postgres (creates home_library DB automatically)
docker compose up -d

# 2. Backend setup
cd backend
python3 -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env               # defaults match docker-compose.yml
python3 setup_db.py                # create tables
uvicorn main:app --reload
```

**Try it:**

- Health: http://127.0.0.1:8000/health
- Books: http://127.0.0.1:8000/books
- API docs: http://127.0.0.1:8000/docs

**Optional demo data** (pgAdmin, psql, or Query Tool):

```sql
INSERT INTO books (title) VALUES ('The Hobbit');
```

## Stop Postgres

```bash
docker compose down
```

Data is kept in a Docker volume. Run `docker compose down -v` to wipe it.

## Port conflict

If port 5432 is already in use (local Postgres/pgAdmin), stop that service first, or change the port in `docker-compose.yml` (e.g. `"5433:5432"`) and set `DB_PORT=5433` in `.env`.

## Project layout

```
backend/
  main.py              # uvicorn entry point
  setup_db.py          # apply db_setup.sql (tables)
  app/
    routers/           # HTTP routes
    models/            # SQLAlchemy models
    schemas/           # Pydantic API shapes
    services/          # business logic
```
