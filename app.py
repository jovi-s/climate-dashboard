import yaml
import streamlit as st
from src.utils import display_image_from_url


with open("./src/config.yaml", "r") as file:
    config = yaml.safe_load(file)


st.title("Severe Climate Data Visualizations")

global_tab, regional_tab, local_tab = st.tabs(["Global", "Regional", "Local"])

# Function to display an image with a description
def display_image_with_description(description, image_url):
    st.markdown(description)
    st.image(image_url, use_column_width=True)

# Global Tab Content
with global_tab:
    descriptions_and_images = [
        ("Warming stripes for 1850-2018 using the WMO annual global temperature dataset", config["IMAGES_URL"]["Warming stripes for 1850-2018 using the WMO annual global temperature dataset"]),
        ("Climate spiral for the WMO global temperature dataset", config["IMAGES_URL"]["Climate spiral for the WMO global temperature dataset"]),
        ("Arctic sea ice concentration from NSIDC for Septembers during 1979-2018", config["IMAGES_URL"]["Arctic sea ice concentration from NSIDC for Septembers during 1979-2018"]),
        ("Earth’s Hottest Day on Record", config["IMAGES_URL"]["Earth’s Hottest Day on Record"]),
        ("Carbon Dioxide MEASUREMENT June 2024", config["IMAGES_URL"]["Carbon Dioxide MEASUREMENT June 2024"]),
        ("Global Temperature 2023", config["IMAGES_URL"]["Global Temperature 2023"]),
        ("Sea Level SATELLITE DATA 1993-June 2024", config["IMAGES_URL"]["Sea Level SATELLITE DATA 1993-June 2024"]),
        ("Ocean Warming HEAT CONTENT CHANGES SINCE 1955-December 2023 (NOAA)", config["IMAGES_URL"]["Ocean Warming HEAT CONTENT CHANGES SINCE 1955-December 2023 (NOAA)"])
    ]

    # Display images in groups of 3
    for i in range(0, len(descriptions_and_images), 3):
        with st.container():
            cols = st.columns(3)
            for j, col in enumerate(cols):
                if i + j < len(descriptions_and_images):
                    with col:
                        description, image_url = descriptions_and_images[i + j]
                        display_image_with_description(description, image_url)
