# Build stage
FROM python:3.12 AS builder

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# Install uv (avoid ghcr.io pull which can hit rate limits / auth errors)
RUN curl -LsSf https://astral.sh/uv/install.sh | sh
ENV PATH="/root/.local/bin:$PATH"

# Set the working directory
WORKDIR /app

# Copy dependency files
COPY pyproject.toml uv.lock /app/

# Install dependencies (no venv, install into system Python)
RUN uv sync --no-dev --no-install-project --python-preference system

# Copy application code
COPY . /app

# Production stage
FROM python:3.12-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# Copy installed Python packages and application code from builder
COPY --from=builder /usr/local/lib/python3.12/site-packages/ /usr/local/lib/python3.12/site-packages/
COPY --from=builder /usr/local/bin/ /usr/local/bin/
COPY --from=builder /app/ /app/

# Expose the default port
EXPOSE 8081

# Run the application
CMD ["uvicorn", "fastapi_app:app", "--host", "0.0.0.0", "--port", "8081"]
