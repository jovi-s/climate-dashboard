import yaml
import streamlit as st
from src.utils import display_image_from_url


with open("./src/config.yaml", "r") as file:
    config = yaml.safe_load(file)


st.title("Severe Climate Data Visualizations")

# Create containers to display the images and gifs
with st.container():
    col1, col2, col3 = st.columns(3)

    with col1:
        wmo = "Warming stripes for 1850-2018 using the WMO annual global temperature dataset"
        st.markdown(wmo)
        st.image(
            display_image_from_url(config["IMAGES_URL"][wmo]), use_column_width=True
        )

    with col2:
        climate_spiral = "Climate spiral for the WMO global temperature dataset"
        st.markdown(climate_spiral)
        st.image(
            config["IMAGES_URL"][climate_spiral],
            use_column_width=True,
        )

    with col3:
        arctic_sea_ice = (
            "Arctic sea ice concentration from NSIDC for Septembers during 1979-2018"
        )
        st.markdown(arctic_sea_ice)
        st.image(
            config["IMAGES_URL"][arctic_sea_ice],
            use_column_width=True,
        )

with st.container():
    col1, col2, col3 = st.columns(3)

    with col1:
        hottest_day = "Earth’s Hottest Day on Record"
        st.markdown(hottest_day)
        # Display the image from the url
        st.image(config["IMAGES_URL"][hottest_day], use_column_width=True)

    with col2:
        climate_spiral = "Carbon Dioxide MEASUREMENT June 2024"
        st.markdown(climate_spiral)
        st.image(config["IMAGES_URL"][climate_spiral], use_column_width=True)

    with col3:
        arctic_sea_ice = "Global Temperature 2023"
        st.markdown(arctic_sea_ice)
        st.image(config["IMAGES_URL"][arctic_sea_ice], use_column_width=True)

with st.container():
    col1, col2, col3 = st.columns(3)

    with col1:
        sea_level = "Sea Level SATELLITE DATA 1993-June 2024"
        st.markdown(sea_level)
        st.image(config["IMAGES_URL"][sea_level], use_column_width=True)

    with col2:
        ocean_warming = (
            "Ocean Warming HEAT CONTENT CHANGES SINCE 1955-December 2023 (NOAA)"
        )
        st.markdown(ocean_warming)
        st.image(config["IMAGES_URL"][ocean_warming], use_column_width=True)
