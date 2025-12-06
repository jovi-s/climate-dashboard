install:
	poetry install --no-root

lint:
	poetry run ruff check --fix --unsafe-fixes src/
	poetry run ruff format src/

fastapi:
	poetry run uvicorn fastapi_app:app --reload

local-build:
	docker build --platform=linux/amd64 -t climate-crisis-app .

local-run:
	docker run --platform=linux/amd64 --rm -p 8080:8080 climate-crisis-app

save:
	docker save climate-crisis-app -o climate-crisis-app.tar

# Follow instructions in README for Github Container Registry before running
gcr:
	docker build --no-cache --platform linux/amd64 . -t ghcr.io/jovi-s/climate-crisis-app:latest              
	docker push ghcr.io/jovi-s/climate-crisis-app:latest


# <ARCHIVED MAKE COMMANDS>


app:
	poetry run streamlit run app.py

gcloud-setup:
	gcloud auth login
	gcloud config set project climate-dashboard-docker-image

gcloud-access-token:
	gcloud auth print-access-token

# Google Cloud Run Deployment - For Streamlit App (Use region 9)
gcloud-run:
	gcloud config set run/region asia-southeast1
	gcloud run deploy --memory 2G --service-min-instances 0 --max-instances 1 --source .

gar-images:
	gcloud artifacts repositories list

gar-build:
	docker build --no-cache --platform linux/amd64 -t climate-crisis-app -f Dockerfile .
	docker images | grep -i "climate-crisis-app"

# Google Artifact Registry API - For Render Deployment (Deploy a Prebuilt Docker Image)
gar-push:
	gcloud auth configure-docker us-central1-docker.pkg.dev
	docker tag climate-crisis-app:latest us-central1-docker.pkg.dev/climate-dashboard-docker-image/prebuilt-docker-images/climate-crisis-app:latest
	docker push us-central1-docker.pkg.dev/climate-dashboard-docker-image/prebuilt-docker-images/climate-crisis-app:latest