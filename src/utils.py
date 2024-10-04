from io import BytesIO

import pandas as pd
import requests
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
