from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

def sanitize_database_url(database_url: str) -> str:
    if database_url.startswith("postgres://"):
        database_url = database_url.replace("postgres://", "postgresql://", 1)

    # Remove invalid psycopg2 options (e.g., supa from Supabase extra connection args)
    if database_url.startswith("postgresql://"):
        from urllib.parse import parse_qs, urlencode, urlparse, urlunparse

        parsed = urlparse(database_url)
        query = parse_qs(parsed.query, keep_blank_values=True)

        for invalid_key in ["supa"]:
            query.pop(invalid_key, None)

        cleaned_query = urlencode(query, doseq=True)
        database_url = urlunparse(parsed._replace(query=cleaned_query))

    return database_url


database_url = os.getenv("DATABASE_URL", "sqlite:///./quiz_app.db")
SQLALCHEMY_DATABASE_URL = sanitize_database_url(database_url)

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in SQLALCHEMY_DATABASE_URL else {},
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
