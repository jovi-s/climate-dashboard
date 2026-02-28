install:
	uv sync

lint:
	uv run ruff check --fix --unsafe-fixes src/
	uv run ruff format src/

fastapi:
	uv run uvicorn fastapi_app:app --reload

server-build:
	docker build --platform=linux/amd64 -t climate-crisis-app .

server-run:
	docker run --platform=linux/amd64 --rm -p 8080:8080 climate-crisis-app

save:
	docker save climate-crisis-app -o climate-crisis-app.tar

# Follow instructions in README for Github Container Registry before running
gcr:
	docker build --no-cache --platform linux/amd64 . -t ghcr.io/jovi-s/climate-crisis-app:latest              
	docker push ghcr.io/jovi-s/climate-crisis-app:latest
