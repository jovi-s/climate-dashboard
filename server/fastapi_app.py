import asyncio
import base64
import json
import logging
import os
from asyncio import Lock
from contextlib import asynccontextmanager
from io import BytesIO
from typing import Dict

import matplotlib
import matplotlib.pyplot as plt
import yaml
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse
from pydantic import BaseModel

from src.btr import BTRRAGAgent
from src.ndc_inference import init_ndc_comparison_agents, load_ndc_data
from src.news_sentiment import OverallClimateNewsSentimentAnalyzer
from src.future_projection import generate_climate_future_projection
from src.plot_graphs import (
    global_temperature_anomaly,
    plot_co2_data,
    plot_methane_data,
    plot_world_ocean_warming_1992,
)
from src.typing import Request
from src.utils import fetch_and_extract_href, fetch_global_data


# Configure Matplotlib to use a non-GUI backend
matplotlib.use("Agg")


# Load the YAML configuration file
with open("./src/config.yaml", "r") as file:
    config = yaml.safe_load(file)


co2_data, methane_data, temp_data, ocean_data = fetch_global_data(config)


# Global variable for the vector store engine
btr_lock = Lock()
btr_query_engine = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    logging.info("Loading NDC data at startup...")
    load_ndc_data()
    logging.info("NDC data loaded successfully.")
    yield


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)


@app.get("/")
async def read_root():
    return {"Hello": "World"}


@app.get("/api/cat-summary")
async def get_cat_summary(selected_local_country: str):
    """Endpoint to retrieve CAT summary data."""
    logging.info(f"Fetching data for country: {selected_local_country}")
    BASE_URL = "https://climateactiontracker.org/countries/"
    local_country_url = f"{BASE_URL}{selected_local_country}/"
    absolute_href = fetch_and_extract_href(local_country_url)
    return {
        "image_url": absolute_href,
        "country_url": local_country_url,
    }


@app.get("/api/ndc-comparison")
async def get_ndc_comparison(selected_countries: str):
    """Endpoint to retrieve NDC comparison data."""
    countries_list = [
        country.strip() for country in selected_countries.split(",") if country.strip()
    ]
    if len(countries_list) < 2:
        raise HTTPException(
            status_code=400, detail="Please provide at least 2 selected countries."
        )

    logging.info(f"Comparing NDCs of countries: {countries_list}")
    top_agent = init_ndc_comparison_agents(countries_list)
    prompt = f"Compare the features of the NDCs of these countries: {tuple(countries_list)}"
    response = top_agent.query(prompt)
    return {"text": str(response)}


@app.get("/api/initialize-btr-rag")
async def initialize_btr_rag(btr_rag_country: str):
    """Endpoint to initialize the BTR RAG agent for a specific country."""
    global btr_query_engine

    async with btr_lock:  # Ensures only one request initializes at a time
        if btr_query_engine is not None:
            return {
                "message": f"BTR RAG agent already initialized for {btr_rag_country}"
            }

        btr_query_engine = BTRRAGAgent(country=btr_rag_country)
        return {"message": f"BTR RAG agent initialized for {btr_rag_country}"}


@app.post("/api/btr-chat")
async def handle_chat_data(request: Request):
    """Endpoint to handle chat data for BTR RAG."""
    global btr_query_engine

    if not request.messages:
        raise HTTPException(
            status_code=400, detail="Missing 'messages' in request body."
        )

    if btr_query_engine is None:
        logging.error("No BTR RAG Query Engine initialized.")
        raise HTTPException(
            status_code=404, detail="No BTR RAG Query Engine initialized."
        )

    # Get the response text from the agent
    input_text = request.messages[-1].content
    logging.info(f"Received input: {input_text}")
    response_text = btr_query_engine.query(input_text)

    # Define a generator that yields chunks of text
    async def simple_stream():
        chunk_size = 100
        for i in range(0, len(response_text), chunk_size):
            yield f"0:{json.dumps(response_text[i:i + chunk_size])}\n"
            await asyncio.sleep(0.01)

    response = StreamingResponse(simple_stream(), media_type="text/plain")
    response.headers["x-vercel-ai-data-stream"] = "v1"
    return response


def create_image_response(fig) -> Dict[str, str]:
    """Helper function to return Matplotlib plot as an image response."""
    buf = BytesIO()
    fig.savefig(buf, format="png")
    buf.seek(0)
    plt.close(fig)
    img_str = base64.b64encode(buf.read()).decode("utf-8")
    return {"image": img_str}


@app.get("/plot/co2")
async def plot_co2():
    """Endpoint to plot Carbon Dioxide data."""
    co2_fig = plot_co2_data(co2_data)
    co2_response = create_image_response(co2_fig)
    co2_response["source"] = config["IMAGES_DATA"]["Carbon Dioxide (PPM)"][
        "Data source"
    ]
    return JSONResponse(co2_response)


@app.get("/plot/methane")
async def plot_methane():
    """Endpoint to plot Atmospheric Methane data."""
    methane_fig = plot_methane_data(methane_data)
    methane_response = create_image_response(methane_fig)
    methane_response["source"] = config["IMAGES_DATA"]["Atmospheric Methane (PPB)"][
        "Data source"
    ]
    return JSONResponse(methane_response)


@app.get("/plot/temperature-anomaly")
async def plot_temperature_anomaly():
    """Endpoint to plot Global Temperature Anomaly data."""
    temp_fig = global_temperature_anomaly(temp_data)
    temp_response = create_image_response(temp_fig)
    temp_response["source"] = config["IMAGES_DATA"]["Global Temperature Anomaly (C)"][
        "Data source"
    ]
    return JSONResponse(temp_response)


@app.get("/plot/ocean-warming")
async def plot_world_ocean():
    """Endpoint to plot World Ocean Warming data."""
    ocean_fig = plot_world_ocean_warming_1992(ocean_data)
    ocean_response = create_image_response(ocean_fig)
    ocean_response["source"] = config["IMAGES_DATA"]["World Ocean Warming (C)"][
        "Data source"
    ]
    return JSONResponse(ocean_response)


@app.get("/images/url-links")
async def get_image_links():
    """Endpoint to retrieve image links."""

    def transform_yaml_to_json(data: Dict) -> Dict:
        """Transform YAML structure into JSON format."""
        data.pop("IMAGES_DATA", None)
        return {
            category: [
                {
                    "title": title,
                    "url": details["URL"],
                    "source": details.get("Data source", "Unknown Source"),
                }
                for title, details in images.items()
            ]
            for category, images in data.items()
        }

    json_data = transform_yaml_to_json(config.copy())
    return json_data


class ClimateFutureProjectionSummaries(BaseModel):
    """The three longitudinal report summaries."""

    copernicus: str
    ipcc: str
    wmo: str


class ClimateFutureProjectionRequest(BaseModel):
    """Request body for climate future projection."""

    newsReport: str
    summaries: ClimateFutureProjectionSummaries


@app.get("/api/news-sentiment")
async def get_news_sentiment():
    """Endpoint to retrieve news sentiment data."""
    analyzer = OverallClimateNewsSentimentAnalyzer(
        query="climate change, global warming", max_articles=20
    )
    report = analyzer.run()
    return {"report": report}


@app.post("/api/climate-future-projection")
async def post_climate_future_projection(body: ClimateFutureProjectionRequest):
    """Generate a short, evidence-based future projection from news report and summaries."""
    if not body.newsReport or not body.summaries:
        raise HTTPException(
            status_code=400,
            detail="Missing 'newsReport' or 'summaries' in request body.",
        )
    copernicus = (body.summaries.copernicus or "").strip()
    ipcc = (body.summaries.ipcc or "").strip()
    wmo = (body.summaries.wmo or "").strip()
    if not copernicus or not ipcc or not wmo:
        raise HTTPException(
            status_code=400,
            detail="summaries must include non-empty copernicus, ipcc, and wmo.",
        )
    try:
        projection = generate_climate_future_projection(
            news_report=(body.newsReport or "").strip(),
            copernicus=copernicus,
            ipcc=ipcc,
            wmo=wmo,
        )
        return {"projection": projection}
    except Exception as e:
        logging.exception("Climate future projection failed: %s", e)
        raise HTTPException(
            status_code=500,
            detail="Failed to generate climate future projection.",
        ) from e
