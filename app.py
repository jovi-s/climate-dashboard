import streamlit as st
import yaml

from src.plot_graphs import (
    fetch_data,
    global_temperature_anomaly,
    plot_co2_data,
    plot_methane_data,
    plot_world_ocean_warming_1992,
)
from src.utils import countries_list

# import earthkit.maps


# Function to load CSS from an external file
def load_css(css_file_path):
    with open(css_file_path) as f:
        st.markdown(f"<style>{f.read()}</style>", unsafe_allow_html=True)


# Load the CSS
load_css("./assets/styles.css")

with open("./src/config.yaml", "r") as file:
    config = yaml.safe_load(file)

st.title("A Climate in Crisis")
global_tab, regional_tab, local_tab, ndc_tab, ncqg_tab, action_tab = st.tabs(
    ["Global", "Regional", "Local", "NDCs", "NCQG", "Take Action!"]
)


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
                f'<p class="source-text">Sourced from: {config["IMAGES_DATA"]["Carbon Dioxide (PPM)"]["Data source"]}</p>',
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
                f'<p class="source-text">Sourced from: {config["IMAGES_DATA"]["Atmospheric Methane (PPB)"]["Data source"]}</p>',
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
            ocean_plot = plot_world_ocean_warming_1992(ocean_data)
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
    # with st.container():
    #     col1, col2 = st.columns(2)
    #     data = ek.data.from_source(
    #             'cds',
    #             'reanalysis-era5-single-levels',
    #             {
    #                 'product_type': 'reanalysis',
    #                 'variable': '2m_temperature',
    #                 'year': '2023',
    #                 'month': '07',
    #                 'day': '3',
    #                 'time': '12:00',
    #             },
    #         )
    #     with col1:
    #         st.image(ek.plots.globe(data))
    #     with col2:
    #         st.image(ek.maps.quickplot(data))

    # chart = ek.maps.Chart(rows=2, columns=3)

    # for domain in [
    #         "South East Asia",
    #         "Asia",
    # ]:
    #     chart.add_subplot(domain=domain)

    # chart.stock_img()
    # chart.coastlines()
    # chart.borders()
    # chart.gridlines()

    # chart.subplot_titles("{domain}")

    # st.image(chart)

with local_tab:
    st.subheader("LOCAL INFORMATION UNDER DEVELOPMENT")

    # chart = ek.maps.Chart(rows=2, columns=3)

    # chart.add_subplot(domain="Singapore")

    # chart.stock_img()
    # chart.coastlines()
    # chart.borders()
    # chart.gridlines()

    # chart.subplot_titles("{domain}")

    # st.image(chart)

with ndc_tab:
    st.subheader("Nationally Determined Contributions (NDCs)")
    st.markdown("Analysis of NDCs is under development.")

with ncqg_tab:
    st.subheader("New Collective Quantified Goal (NCQG)")
    st.markdown("Analysis of NCQG is under development.")

with action_tab:
    st.subheader("Take Action Now!")
    st.markdown("Select your country below to find out how you can take action.")
    country = st.selectbox("Select your country", countries_list())
    st.markdown(
        f"Click the button below to send emails to ALL your public representatives in {country}!"
    )

    if st.button("💻Make a Difference!🧿"):
        st.success(
            "🦹Under development"
        )  # Placeholder for future functionality: Emails sent successfully!
        st.balloons()
