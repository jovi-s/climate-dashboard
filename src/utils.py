from io import BytesIO
from urllib.parse import urljoin

import pandas as pd
import requests
from bs4 import BeautifulSoup
from PIL import Image


# Function to display an image from a URL in Streamlit
def display_image_from_url(image_url):
    # Load the image from the URL
    response = requests.get(image_url)
    img = Image.open(BytesIO(response.content))

    return img


def countries_list():
    # Load the list of countries from a CSV file
    countries_df = pd.read_csv("data/list_of_countries.csv")

    return countries_df["Name"].tolist()


climate_action_tracker_countries = [
    "singapore",
    "argentina",
    "australia",
    "bhutan",
    "brazil",
    "canada",
    "chile",
    "china",
    "colombia",
    "costa-rica",
    "eu",
    "egypt",
    "ethiopia",
    "gabon",
    "germany",
    "india",
    "indonesia",
    "iran",
    "japan",
    "kazakhstan",
    "kenya",
    "mexico",
    "morocco",
    "nepal",
    "new-zealand",
    "nigeria",
    "norway",
    "peru",
    "philippines",
    "russian-federation",
    "saudi-arabia",
    "south-africa",
    "south-korea",
    "switzerland",
    "thailand",
    "gambia",
    "turkey",
    "uae",
    "usa",
    "ukraine",
    "uk",
    "vietnam",
]


def fetch_and_extract_href(url):
    try:
        response = requests.get(url)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, "html.parser")

        # Locate the <div> with data-component-graph-embed
        graph_div = soup.find("div", attrs={"data-component-graph-embed": True})
        if graph_div:
            # Extract the 'data-props-graph-hires-image-url'
            relative_href = graph_div.get("data-props-graph-hires-image-url")
            if relative_href:
                absolute_href = urljoin(url, relative_href)
                return absolute_href
            else:
                return "'data-props-graph-hires-image-url' attribute not found."
        else:
            return "<div> with 'data-component-graph-embed' not found."
    except requests.exceptions.RequestException as e:
        return f"Request failed: {e}"
