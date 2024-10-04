app:
	streamlit run app.py

install:
	poetry install

lint:
	ruff check --fix --unsafe-fixes
	ruff format .

shell:
	poetry shell

fastapi:
	poetry run uvicorn fastapi_app:app --reload
