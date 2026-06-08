"""Database package — SQLModel engine + session plumbing."""

from app.db.client import DB_PATH, engine, get_session, init_db

__all__ = ["DB_PATH", "engine", "get_session", "init_db"]
