app:
	poetry run streamlit run app.py

install:
	poetry install

lint:
	poetry run ruff check --fix --unsafe-fixes
	poetry run ruff format .

# shell:
# 	poetry shell

fastapi:
	poetry run uvicorn fastapi_app:app --reload

docker-build:
	docker build -t climate-crisis-streamlit-app .

docker-run:
	docker run -p 8501:8501 climate-crisis-streamlit-app

gcloud-setup:
	gcloud config set project climate-crisis-dashboard
	gcloud config set run/region asia-southeast1

# Use region 9
deploy:
	gcloud run deploy --memory 1G --service-min-instances 0 --max-instances 1 --source .
