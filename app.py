import yaml
import streamlit as st
from src.plot_graphs import (
    fetch_data,
    plot_co2_data,
    plot_methane_data,
    global_temperature_anomaly,
    plot_world_ocean_warming,
)


# Function to load CSS from an external file
def load_css(css_file_path):
    with open(css_file_path) as f:
        st.markdown(f"<style>{f.read()}</style>", unsafe_allow_html=True)


# Load the CSS
load_css("./assets/styles.css")

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
    # This containter pull latest data from txt files and plot the data
    with st.container():
        col1, col2 = st.columns(2)
        with col1:
            # Plot and display CO2 data
            co2_data = fetch_data(config["IMAGES_DATA"]["Carbon Dioxide (PPM)"]["URL"])
            co2_plot = plot_co2_data(co2_data)
            st.pyplot(co2_plot)
            st.markdown(
                f'<p class="source-text">Sourced from: {config['IMAGES_DATA']['Carbon Dioxide (PPM)']['Data source']}</p>',
                unsafe_allow_html=True,
            )
        with col2:
            # Plot and display Methane data
            methane_data = fetch_data(
                config["IMAGES_DATA"]["Atmospheric Methane (PPB)"]["URL"]
            )
            methane_plot = plot_methane_data(methane_data)
            st.pyplot(methane_plot)
            st.markdown(
                f'<p class="source-text">Sourced from: {config['IMAGES_DATA']['Atmospheric Methane (PPB)']['Data source']}</p>',
                unsafe_allow_html=True,
            )

    with st.container():
        col1, col2 = st.columns(2)
        with col1:
            # Plot and display Global Temperature Anomaly data
            temp_data = fetch_data(
                config["IMAGES_DATA"]["Global Temperature Anomaly (C)"]["URL"]
            )
            temp_plot = global_temperature_anomaly(temp_data)
            st.pyplot(temp_plot)
            st.markdown(
                f'<p class="source-text">Sourced from: {config["IMAGES_DATA"]["Global Temperature Anomaly (C)"]["Data source"]}</p>',
                unsafe_allow_html=True,
            )
        with col2:
            # Plot and display Global Ocean Warming data
            ocean_data = fetch_data(
                config["IMAGES_DATA"]["World Ocean Warming (C)"]["URL"]
            )
            ocean_plot = plot_world_ocean_warming(ocean_data)
            st.pyplot(ocean_plot)
            st.markdown(
                f'<p class="source-text">Sourced from: {config["IMAGES_DATA"]["World Ocean Warming (C)"]["Data source"]}</p>',
                unsafe_allow_html=True,
            )

    st.divider()

    # This container pulls images from the web and displays them
    with st.container():
        col1, col2 = st.columns(2)
        with col1:
            # Get the specific image information
            image_key = "Earth’s Hottest Day on Record"
            image_info = config["IMAGES_LINKS"][image_key]
            st.image(image_info["URL"], caption=image_key)

            # Display data source
            st.markdown(
                f'<p class="source-text">Sourced from: {image_info["Data source"]}</p>',
                unsafe_allow_html=True,
            )
        with col2:
            # Get the specific image information
            image_key = "Intensification of Adverse Impacts"
            image_info = config["IMAGES_LINKS"][image_key]
            st.image(image_info["URL"], caption=image_key)

            # Display data source
            st.markdown(
                f'<p class="source-text">Sourced from: {image_info["Data source"]}</p>',
                unsafe_allow_html=True,
            )

    st.divider()

    # This container uses static images!
    # Dynamically create the list of tuples (description, URL, data source)
    descriptions_and_images = [
        (desc, info["URL"], info["Data source"])
        for desc, info in config["IMAGES_URL"].items()
    ]

    # Display images in groups of 3
    for i in range(0, len(descriptions_and_images), 3):
        with st.container():
            cols = st.columns(3)
            for j, col in enumerate(cols):
                if i + j < len(descriptions_and_images):
                    with col:
                        description, image_url, data_source = descriptions_and_images[
                            i + j
                        ]

                        # Display image with description
                        st.image(image_url, caption=description)

                        # Display data source
                        st.markdown(
                            f'<p class="source-text">Sourced from: {data_source}</p>',
                            unsafe_allow_html=True,
                        )


with regional_tab:
    st.subheader("REGIONAL INFORMATION UNDER DEVELOPMENT")

with local_tab:
    st.subheader("LOCAL INFORMATION UNDER DEVELOPMENT")
