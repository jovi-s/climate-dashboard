# Climate Dashboard Server Guide

## Build & Run Commands
- Install dependencies: `make install`
- Run FastAPI server: `make fastapi`
- Run linting: `make lint`
- Build Docker image: `make local-build`
- Run Docker container: `make local-run`
- Push to Github Container Registry: `make gcr`

## Code Style Guidelines
- **Formatting**: Use Ruff with Black-compatible settings (88 char line length, double quotes)
- **Imports**: Sort imports with isort (handled by Ruff)
- **Python Version**: Target Python 3.12
- **Error Handling**: Use logging and proper HTTP exceptions for API errors
- **Type Hints**: Always use proper type annotations (List, Dict, etc.)
- **Docstrings**: Include explanatory docstrings for functions/endpoints with usage examples
- **Function Organization**: Organize FastAPI endpoints by feature area
- **Async Pattern**: Use asyncio and proper locking for concurrent operations
- **Environment Variables**: Use python-dotenv for configuration
- **Testing**: Test API endpoints using pytest (when adding tests)