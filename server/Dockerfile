# Use the official Python 3.12.8 slim image as the base
FROM python:3.12.8-slim

# Set environment variables to prevent Python from writing .pyc files and to buffer stdout/stderr
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# Define Poetry version
ENV POETRY_VERSION=2.0.1

# Install system dependencies and Poetry
RUN apt-get update && \
    apt-get install -y --no-install-recommends curl && \
    curl -sSL https://install.python-poetry.org | python3 - --version $POETRY_VERSION && \
    ln -s /root/.local/bin/poetry /usr/local/bin/poetry && \
    # Clean up to reduce image size
    apt-get purge -y --auto-remove curl && \
    rm -rf /var/lib/apt/lists/* /root/.cache/pip

# Set the working directory to /app
WORKDIR /app

# Copy only the dependency specification files to leverage Docker cache
COPY pyproject.toml poetry.lock* /app/

# Configure Poetry: Do not create a virtual environment as the container itself provides isolation
RUN poetry config virtualenvs.create false

# Install project dependencies using Poetry
RUN poetry install --no-root --no-interaction --no-ansi --no-cache

# Copy the rest of the application code
COPY . /app

# Expose the default port
EXPOSE 8080

# Specify the command to run the app using Poetry
CMD ["poetry", "run", "uvicorn", "fastapi_app:app", "--host", "0.0.0.0", "--port", "8080"]
