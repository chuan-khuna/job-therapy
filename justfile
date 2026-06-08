set windows-shell := ["powershell.exe", "-NoLogo", "-Command"]

# List available recipes
default:
    just --list

# --- Frontend (Next.js — frontend/) -----------------------------------------

# Start the frontend dev server
[working-directory('frontend')]
frontend-dev:
    bun run dev

# Build the frontend for production
[working-directory('frontend')]
frontend-build:
    bun run build

# Start the frontend production server
[working-directory('frontend')]
frontend-start:
    bun run start

# Lint the frontend
[working-directory('frontend')]
frontend-lint:
    bun run lint

# Format frontend files with Prettier
[working-directory('frontend')]
frontend-format:
    bun run format

# Install frontend dependencies
[working-directory('frontend')]
frontend-install:
    bun install

# --- Backend (FastAPI — backend/) -------------------------------------------

# Start the backend dev server (auto-reload) at http://127.0.0.1:8000
[working-directory('backend')]
backend-dev:
    uv run uvicorn app.main:app --reload

# Install backend dependencies
[working-directory('backend')]
backend-install:
    uv sync

# Lint the backend with ruff
[working-directory('backend')]
backend-lint:
    uv run ruff check .

# Format the backend with ruff
[working-directory('backend')]
backend-format:
    uv run ruff format .
