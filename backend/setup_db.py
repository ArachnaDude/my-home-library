"""Apply db_setup.sql to Postgres. Run: python setup_db.py"""

import os
from pathlib import Path

import psycopg
from dotenv import load_dotenv

load_dotenv()

DB_NAME = os.getenv("DB_NAME", "home_library")
DB_USER = os.getenv("DB_USER", "matt")
DB_PASSWORD = os.getenv("DB_PASSWORD", "")
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = int(os.getenv("DB_PORT", "5432"))

SQL_PATH = Path(__file__).parent / "db_setup.sql"


def main() -> None:
    conn = psycopg.connect(
        dbname=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD or None,
        host=DB_HOST,
        port=DB_PORT,
    )
    cur = conn.cursor()

    sql = SQL_PATH.read_text()
    for statement in sql.split(";"):
        statement = statement.strip()
        if statement:
            cur.execute(statement)

    conn.commit()
    cur.close()
    conn.close()
    print(f"Applied {SQL_PATH.name} to database '{DB_NAME}'")


if __name__ == "__main__":
    main()
