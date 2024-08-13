app:
	streamlit run app.py

install:
	poetry install

lint:
	ruff format .

shell:
	poetry shell
