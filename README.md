# my-home-library

Personal home library app (React + FastAPI + PostgreSQL).

## Quick start (new machine)

**Prerequisite:** [Docker Desktop](https://www.docker.com/products/docker-desktop/) (includes Docker Compose)

```bash
git clone https://github.com/YOUR_USER/my-home-library.git
cd my-home-library
docker compose up --build
```

Open **http://localhost:5173** in your browser — the home library UI.

**Useful URLs:**

- App: http://localhost:5173
- API docs: http://localhost:8000/docs
- Health check: http://localhost:8000/health

The first start takes a few minutes (image pulls, `npm install`). Watch the terminal until the frontend shows `ready`.

## Stop

```bash
docker compose down
```

Database data is kept in a Docker volume. Run `docker compose down -v` to wipe it (schema is recreated on next start).

## Port conflicts

| Port | Service  | Fix |
|------|----------|-----|
| 8000 | API      | Change backend mapping in `docker-compose.yml` (e.g. `"8001:8000"`) |
| 5173 | Frontend | Change frontend mapping (e.g. `"5174:5173"`) |

## Project layout

```
frontend/              # React + Vite UI
backend/
  Dockerfile           # API container image
  main.py              # uvicorn entry point
  db_setup.sql         # schema (applied on first Postgres start)
  app/
    routers/           # HTTP routes
    models/            # SQLAlchemy models
    schemas/           # Pydantic API shapes
    services/          # business logic
docker-compose.yml     # db + backend + frontend
```

## Optional: local Python dev (without Docker for the API)

If you prefer running the API on the host while Postgres stays in Docker:

```bash
docker compose up -d db
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python3 setup_db.py
uvicorn main:app --reload
```

Use `DB_HOST=localhost` in `.env` (the default in `.env.example`).
