.PHONY: help dev-frontend dev-backend dev

help:
	@echo "Available commands:"
	@echo "  make dev-frontend    - Starts the frontend development server (Next.js)"
	@echo "  make dev-backend     - Starts the backend development server (Uvicorn with reload)"
	@echo "  make dev             - Starts both frontend and backend development servers"

dev-frontend:
	@echo "Starting frontend development server..."
	@cd client && npm run dev

dev-backend:
	@echo "Starting backend development server..."
	@cd server && poetry run uvicorn fastapi_app:app --reload

# Run frontend and backend concurrently
dev:
	@echo "Starting both frontend and backend development servers..."
	@make dev-frontend & make dev-backend

dev-build:
	@cd client && npm run build