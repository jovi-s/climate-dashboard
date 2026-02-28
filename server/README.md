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
- [Online Convert](https://www.online-convert.com/)
- [Healthy-NDCs-Scorecard_2023-Report.pdf](https://climateandhealthalliance.org/wp-content/uploads/2023/05/Healthy-NDCs-Scorecard_2023-Report.pdf)
- [UNFCCC NDCs](https://unfccc.int/NDCREG)
- [UNFCCC BTRs](https://unfccc.int/first-biennial-transparency-reports)
- [UNFCCC National Adaptation Plans](https://napcentral.org/submitted-naps)

## How it works

Summaries are based on new prompt version (`/server/src/prompts.yaml`)

- (text-embedding-3-small) NDCs: Each NDC is vectorized and loaded into `/server/data/vector_store/ndc/`. Agent for `/server/src/ndc_inference.py`loads the vector stores as tools for the query agent for comparative analysis.
    - (Gemini 3.1 Pro) Singapore's generated NDC summaries are stored in: `/client/public/assets`
- BTRs: Singapore's loaded as a RAG chatbot: `/server/data/vector_store/btr/Singapore`
    - (Gemini 3.1 Pro) SG BTR summary is stored in: `/client/public/assets`
- (Gemini 3.0 Pro) WMO Reports: Reports from 2020 - 2025 (`/server/data/wmo_reports`) are summarized using and then an overall summary is generated. Generated summaries are stored in: `/client/public/assets/wmo_reports_pdf_summary/`
- (Gemini 3.1 Pro) GST: from `/server/data/gst/cma2023_16a01E.pdf` to `/client/public/assets/gst_summary.md`
- (Gemini 3.1 Pro) IPCC AR4,5,6 summarized Reports by in `/client/public/assets/ipcc_ar`
- (Gemini 3.0 Pro) Copernicus Global Climate Highlights 2022 - 2025: `/client/public/assets/copernicus-gch/2022-2025_summary.md`

TO ADD:

- ICJ advisory ruling 2025
- WEF Global Risks reports (2021-2025)
- NAPs

### Summarize documents prompt

1. https://developers.openai.com/cookbook/examples/summarizing_long_documents/
    - "Rewrite this text in summarized form."
    - "Text to summarize:\n\"
    - You are a very professional document summarization specialist. Please summarize the given document.
2. Please summarize the document above.
    - "Provide a summary of the following document highlighting the key themes and arguments."
    - "Refine the previous summary to make it more concise, focusing only on the main argument and discarding minor details."
3. Read this document carefully. Then do the following: 1. Identify the 3–5 non-obvious insights — things that aren’t stated explicitly but can be inferred from the content. Skip anything the author already highlights as a key point. 2. Find the tensions or contradictions. Where does the argument conflict with itself, or with conventional wisdom? What’s left unresolved? 3. Extract the “so what.” If a smart, busy person could only take away one actionable implication from this, what would it be and why? 4. Name what’s missing. What question does this document raise but never answer? What would you want to know next? What narrative is this article constructing, and what facts would complicate or undermine that narrative?

## Deployment



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

1. Cloud Build - Creates a Docker image and pushes it to Google Container Registry.
2. Cloud Run - Deploys the Docker image to Google Cloud Run.

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
