set windows-shell := ["powershell.exe", "-NoLogo", "-Command"]

# Start the development server
dev:
    bun run dev

# Build for production
build:
    bun run build

# Start production server
start:
    bun run start

# Run linter
lint:
    bun run lint

# Format all files with Prettier
format:
    bun run format

# Run pending SQL migrations (update path when db module is wired up)
migrate:
    bun run db:migrate

# Install dependencies
install:
    bun install
