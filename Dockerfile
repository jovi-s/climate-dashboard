# Use the official Python 3.12.6 slim image as the base
FROM python:3.12.8-slim

# Set environment variables to prevent Python from writing .pyc files and to buffer stdout/stderr
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# Define Poetry version
ENV POETRY_VERSION=2.0.1

# Install system dependencies including gcc and Poetry
RUN apt-get update && \
    apt-get install -y --no-install-recommends curl build-essential gcc && \
    curl -sSL https://install.python-poetry.org | python3 - --version $POETRY_VERSION && \
    ln -s /root/.local/bin/poetry /usr/local/bin/poetry && \
    # Clean up to reduce image size
    apt-get remove -y curl && \
    apt-get autoremove -y && \
    rm -rf /var/lib/apt/lists/*

# Set the working directory to /app
WORKDIR /app

# Copy only the dependency specification files to leverage Docker cache
COPY pyproject.toml poetry.lock* /app/

# Configure Poetry: Do not create a virtual environment as the container itself provides isolation
RUN poetry config virtualenvs.create false

# Install project dependencies using Poetry
RUN pip install --upgrade pip setuptools wheel
RUN poetry install --no-root --no-interaction --no-ansi --no-cache

# Copy the rest of the application code
COPY . /app

# Expose the default Streamlit port
EXPOSE 8080

# Specify the command to run the Streamlit app using Poetry
CMD ["poetry", "run", "streamlit", "run", "app.py", "--server.port=8080", "--server.address=0.0.0.0"]
