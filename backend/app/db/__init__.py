"""Database package — SQLite connection plumbing."""

from app.db.client import DB_PATH, connect, get_db

__all__ = ["DB_PATH", "connect", "get_db"]
