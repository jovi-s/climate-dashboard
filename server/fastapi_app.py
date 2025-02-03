import asyncio
import base64
import json
import logging

import matplotlib
import yaml

matplotlib.use(
    "Agg"
)  # force Matplotlib to use a backend that does not attempt to draw on the screen

from io import BytesIO
from typing import Dict, List

import matplotlib.pyplot as plt
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse
from pydantic import BaseModel

from src.btr import btr_rag
from src.ndc_inference import multi_document_agents
from src.plot_graphs import (
    global_temperature_anomaly,
    plot_co2_data,
    plot_methane_data,
    plot_world_ocean_warming_1992,
)
from src.utils import fetch_and_extract_href, fetch_global_data, ndc_tracker_data

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Load the YAML configuration file
with open("./src/config.yaml", "r") as file:
    config = yaml.safe_load(file)

co2_data, methane_data, temp_data, ocean_data = fetch_global_data(config)


class BTRRAGAgent:
    def __init__(self, country):
        self.btr_rag_agent = btr_rag(country)

    def query(self, prompt):
        return str(self.btr_rag_agent.query(prompt))


# Global variable for the vector store engine
btr_query_engine = None


class ClientMessage(BaseModel):
    role: str
    content: str


class Request(BaseModel):
    messages: List[ClientMessage]


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/api/cat-summary")
def get_cat_summary(selected_local_country: str):
    """Endpoint to retrieve CAT summary data.
    How to use:
    http://127.0.0.1:8000/api/cat-summary?selected_local_country=singapore
    """
    logging.info(f"Fetching data for country: {selected_local_country}")
    BASE_URL = "https://climateactiontracker.org/countries/"
    local_country_url = BASE_URL + selected_local_country + "/"
    absolute_href = fetch_and_extract_href(local_country_url)
    return {
        "image_url": absolute_href,
        "country_url": local_country_url,
    }


@app.get("/api/ndc-comparison")
def get_ndc_comparison(selected_countries: str):
    """Endpoint to retrieve NDC comparison data.
    How to use:
    http://127.0.0.1:8000/api/ndc-comparison?selected_countries=Singapore,Malaysia
    """
    countries_list = [
        country.strip() for country in selected_countries.split(",") if country.strip()
    ]
    if len(countries_list) >= 2:
        logging.info(f"Comparing NDCs of countries: {countries_list}")
        top_agent = multi_document_agents()
        prompt = f"Compare the features of the NDCs of these countries: {tuple(countries_list)}"
        return {"text": str(top_agent.query(prompt))}
    else:
        raise HTTPException(
            status_code=400, detail="Please provide at least 2 selected countries."
        )


@app.get("/api/ndc-tracker")
def get_ndc_tracker():
    # In a production app, you might validate data and query a database.
    if not ndc_tracker_data:
        raise HTTPException(status_code=404, detail="No NDC data available.")
    return ndc_tracker_data


@app.get("/api/initialize-btr-rag")
def initialize_btr_rag(btr_rag_country: str):
    """Endpoint to initialize the BTR RAG agent for a specific country.
    To run this in your browser, use the following URL:
    http://127.0.0.1:8000/api/initialize-btr-rag?btr_rag_country=Singapore
    """
    global btr_query_engine
    if btr_query_engine is not None:
        # print(f"BTR RAG agent already initialized for country: {btr_rag_country}")
        return {"message": f"BTR RAG agent already initialized for {btr_rag_country}"}

    # Initialize and store the agent for the specified country
    btr_query_engine = BTRRAGAgent(btr_rag_country)
    # print(f"BTR RAG agent initialized for country: {btr_rag_country}")
    return {"message": f"BTR RAG agent initialized for {btr_rag_country}"}


@app.post("/api/btr-chat")
async def handle_chat_data(request: Request):
    """Code adapted from:
    https://github.dev/vercel-labs/ai-sdk-preview-python-streaming/blob/main/api/index.py"""
    global btr_query_engine

    messages = request.messages
    if not messages:
        raise HTTPException(
            status_code=400, detail="Missing 'messages' in request body."
        )

    if btr_query_engine is None:
        print("No BTR RAG Query Engine initialized.")
        raise HTTPException(
            status_code=404, detail="No BTR RAG Query Engine initialized."
        )

    # Get the response text from the agent
    content_list = [message.content for message in messages]
    # print(content_list)
    input = content_list[-1]
    print(input)
    response_text = btr_query_engine.query(input)
    # print(response_text)

    # Define a generator that yields chunks of text
    async def simple_stream():
        chunk_size = 100
        for i in range(0, len(response_text), chunk_size):
            yield "0:{text}\n".format(
                text=json.dumps(response_text[i : i + chunk_size])
            )
            await asyncio.sleep(0.02)

    response = StreamingResponse(simple_stream(), media_type="text/plain")
    response.headers["x-vercel-ai-data-stream"] = "v1"
    return response


def create_image_response(fig):
    """Helper function to return Matplotlib plot as an image response."""
    buf = BytesIO()
    fig.savefig(buf, format="png")
    buf.seek(0)
    plt.close(fig)
    # return FileResponse(buf, media_type="image/png")
    # Encode the binary image as base64.
    img_str = base64.b64encode(buf.read()).decode("utf-8")
    return {"image": img_str}


@app.get("/plot/co2")
def plot_co2():
    """Endpoint to plot Carbon Dioxide data.
    How to use:
    http://127.0.0.1:8000/plot/co2"""
    co2_fig = plot_co2_data(co2_data)
    co2_response = create_image_response(co2_fig)
    co2_response["source"] = config["IMAGES_DATA"]["Carbon Dioxide (PPM)"][
        "Data source"
    ]
    return JSONResponse(co2_response)


@app.get("/plot/methane")
def plot_methane():
    """Endpoint to plot Atmospheric Methane data."""
    methane_fig = plot_methane_data(methane_data)
    methane_response = create_image_response(methane_fig)
    methane_response["source"] = config["IMAGES_DATA"]["Atmospheric Methane (PPB)"][
        "Data source"
    ]
    return JSONResponse(methane_response)


@app.get("/plot/temperature-anomaly")
def plot_temperature_anomaly():
    """Endpoint to plot Global Temperature Anomaly data."""
    temp_fig = global_temperature_anomaly(temp_data)
    temp_response = create_image_response(temp_fig)
    temp_response["source"] = config["IMAGES_DATA"]["Global Temperature Anomaly (C)"][
        "Data source"
    ]
    return JSONResponse(temp_response)


@app.get("/plot/ocean-warming")
def plot_world_ocean():
    """Endpoint to plot World Ocean Warming data."""
    ocean_fig = plot_world_ocean_warming_1992(ocean_data)
    ocean_response = create_image_response(ocean_fig)
    ocean_response["source"] = config["IMAGES_DATA"]["World Ocean Warming (C)"][
        "Data source"
    ]
    return JSONResponse(ocean_response)


@app.get("/images/url-links")
def get_image_links():
    """Endpoint to retrieve image links.
    How to use:
    http://127.0.0.1:8000/images/url-links
    """

    # Transform YAML structure into JSON format
    def transform_yaml_to_json(data: Dict) -> Dict:
        # Remove the key for "World Ocean Warming (C)" from IMAGES_DATA
        if "IMAGES_DATA" in data:
            del data["IMAGES_DATA"]
        formatted_data = {}

        for category, images in data.items():
            formatted_data[category] = [
                {
                    "title": title,
                    "url": details["URL"],
                    "source": details.get("Data source", "Unknown Source"),
                }
                for title, details in images.items()
            ]

        return formatted_data

    json_data = transform_yaml_to_json(config.copy())
    return json_data
