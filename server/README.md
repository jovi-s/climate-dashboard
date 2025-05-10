# climate-dashboard

View climate change statistics around your location.

## How to use

1. `make install`

2. `make shell`

3. `make app`

## Resources

- [Climate Lab Book 2018 Visualisation Update](https://www.climate-lab-book.ac.uk/2018/2018-visualisation-update/)
- [NASA Vital Signs](https://climate.nasa.gov/vital-signs)
- [Dashboard Dashboard](https://jjk-code-otter.github.io/dashboard-dashboard/)
- [CDIAC Projects and Programs](https://rieee.appstate.edu/projects-programs/cdiac/)
- [Climate Central Graphics](https://www.climatecentral.org/resources?type=Graphic&tab=graphics)
- [IPCC AR6 SYR Figures](https://www.ipcc.ch/report/ar6/syr/figures/)
- [Streamlit st.cache_data](https://docs.streamlit.io/develop/api-reference/caching-and-state/st.cache_data)
- [Streamlit st.cache_resource](https://docs.streamlit.io/develop/api-reference/caching-and-state/st.cache_resource)
- [Online Convert](https://www.online-convert.com/)
- [Healthy-NDCs-Scorecard_2023-Report.pdf](https://climateandhealthalliance.org/wp-content/uploads/2023/05/Healthy-NDCs-Scorecard_2023-Report.pdf)

## Deployment

1. Cloud Build - Creates a Docker image and pushes it to Google Container Registry.
2. Cloud Run - Deploys the Docker image to Google Cloud Run.

### Github Container registry

1. 
```
export CR_PAT=YOUR_TOKEN <token found in .env file>
echo $CR_PAT | docker login ghcr.io -u jovi-s --password-stdin
```
2. Login Succeeded!
3. `make gcr`
4. https://github.com/jovi-s/climate-dashboard/pkgs/container/climate-crisis-app/versions
5. Redeploy deployment in railway.com

### Railway.app

Builds container from image:
1. Using github actions workflows - push to github! 
2. -> build local and push to github!

### <archived-deployments>

#### Render

1. Using GitHub backed service doesn't contain data/ and models/ directories as these are not pushed to GitHub thus the server returns ERROR when fetching data
2. https://render.com/docs/deploying-an-image
    - Create a pre-built docker image -> push it to a container registry and use this!
    - Google Artifact Registry Service Account: https://console.cloud.google.com/iam-admin/serviceaccounts?walkthrough_id=iam--create-service-account&project=climate-dashboard-docker-image

3. Push to Google Artifact Registry  
(https://cloud.google.com/artifact-registry/docs/docker/store-docker-container-images)  
(https://cloud.google.com/artifact-registry/docs/docker/pushing-and-pulling)  
    1. `gcloud components update`
    2. `gcloud auth configure-docker us-central1-docker.pkg.dev`
    3. `docker build ...`
    4. `docker tag ?? us-central1-docker.pkg.dev/climate-dashboard-docker-image/prebuilt-docker-images climate-crisis-app:latest`
    5. `docker push us-central1-docker.pkg.dev/climate-dashboard-docker-image/prebuilt-docker-images/climate-crisis-app:latest`
    6. service account username: python-backend@climate-dashboard-docker-image.iam.gserviceaccount.com
    7. docker username: oauth2accesstoken
    8. PAT: gcloud auth print-access-token

4. Pull - After Auth!
    1. `docker pull us-central1-docker.pkg.dev/climate-dashboard-docker-image/prebuilt-docker-images/climate-crisis-app:latest`

Render:
Starter	$7/month	512 MB RAM	0.5 CPU
NEED 1GB RAM!


#### Fly.io

1. fly launch --wait-timeout 600
2. fly apps restart <app name>
3. fly machine restart <machine id>
