import streamlit as st
import yaml

from src.ndc_inference import multi_document_agents
from src.plot_graphs import (
    fetch_data,
    global_temperature_anomaly,
    plot_co2_data,
    plot_methane_data,
    plot_world_ocean_warming_1992,
)
from src.utils import (
    climate_action_tracker_countries,
    countries_list,
    fetch_and_extract_href,
)


# Function to load CSS from an external file
def load_css(css_file_path):
    with open(css_file_path) as f:
        st.markdown(f"<style>{f.read()}</style>", unsafe_allow_html=True)


# Load the CSS
load_css("./assets/styles.css")

with open("./src/config.yaml", "r") as file:
    config = yaml.safe_load(file)


state = st.session_state
if "ndc_comparison" not in state:
    state.ndc_comparison = []

st.title("A Climate in Crisis")
st.text("This app is in active development.")

# Tabs
# Add 'Regional' in future iterations
global_tab, local_tab, ndc_tab, ncqg_tab, action_tab = st.tabs(
    ["Global", "Local", "NDCs", "NCQG", "Take Action!"]
)


# Function to display an image with a description
def display_image_with_description(description, image_url):
    st.markdown(description)
    st.image(image_url, use_column_width=True)


# Global Tab Content
with global_tab:

    @st.cache_data
    def fetch_global_data():
        co2_data = fetch_data(config["IMAGES_DATA"]["Carbon Dioxide (PPM)"]["URL"])
        methane_data = fetch_data(
            config["IMAGES_DATA"]["Atmospheric Methane (PPB)"]["URL"]
        )
        temp_data = fetch_data(
            config["IMAGES_DATA"]["Global Temperature Anomaly (C)"]["URL"]
        )
        ocean_data = fetch_data(config["IMAGES_DATA"]["World Ocean Warming (C)"]["URL"])
        return co2_data, methane_data, temp_data, ocean_data

    co2_data, methane_data, temp_data, ocean_data = fetch_global_data()

    # This containter pull latest data from txt files and plot the data
    with st.container():
        col1, col2 = st.columns(2)
        with col1:
            # Plot and display CO2 data
            co2_plot = plot_co2_data(co2_data)
            st.pyplot(co2_plot)
            st.markdown(
                f'<p class="source-text">Sourced from: {config["IMAGES_DATA"]["Carbon Dioxide (PPM)"]["Data source"]}</p>',
                unsafe_allow_html=True,
            )
        with col2:
            # Plot and display Methane data
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
            temp_plot = global_temperature_anomaly(temp_data)
            st.pyplot(temp_plot)
            st.markdown(
                f'<p class="source-text">Sourced from: {config["IMAGES_DATA"]["Global Temperature Anomaly (C)"]["Data source"]}</p>',
                unsafe_allow_html=True,
            )
        with col2:
            # Plot and display Global Ocean Warming data
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

    st.divider()
    st.markdown("Built with ❤️ by [Jovi](https://www.linkedin.com/in/jovindersingh/)")


# with regional_tab:
#     st.subheader("REGIONAL INFORMATION UNDER DEVELOPMENT")


with local_tab:
    st.markdown("This section provides a summary from Climate Action Tracker.")
    selected_local_country = st.selectbox(
        "Select a country", climate_action_tracker_countries, placeholder="singapore"
    )
    BASE_URL = "https://climateactiontracker.org/countries/"
    local_country_url = BASE_URL + selected_local_country + "/"
    absolute_href = fetch_and_extract_href(local_country_url)
    st.image(absolute_href, use_column_width=True)
    st.markdown(
        f"For more information, visit [Climate Action Tracker]({local_country_url})"
    )


with ndc_tab:
    # Guide: https://unfccc.int/NDCREG
    st.subheader("An AI analysis of Nationally Determined Contributions (NDCs)")

    @st.cache_resource
    def get_top_agent():
        return multi_document_agents()

    with st.spinner("Summarizing Singapore's NDC..."):
        top_agent = get_top_agent()

        @st.cache_data
        def generating_singapore_ndc_summary():
            prompt = "Give me a summary of all the aspects of Singapore's NDC"
            return top_agent.query(prompt)

        singapore_ndc_summary_response = generating_singapore_ndc_summary()
        with st.expander("View an AI generated summary of Singapore's NDC. <click here to expand>"):
            st.markdown(f"{singapore_ndc_summary_response}")

    st.subheader("A comparative analysis of NDCs")
    sea_countries = [
        "Cambodia",
        "Myanmar",
        "Laos",
        "Singapore",
        "Brunei",
        "Vietnam",
        "Malaysia",
        "Indonesia",
    ]
    st.markdown(
        f"This section performs a comparative analysis of NDCs of countries in the South East Asia (SEA) region. "
        f"Countries available for NDC analysis: {', '.join(sea_countries)}."
    )
    # options = state.ndc_comparison
    state.ndc_comparison = st.multiselect(
        "Select at least 2 SEA countries to compare their NDCs",
        sea_countries,
    )

    if len(state.ndc_comparison) >= 2:
       with st.spinner("Comparing NDCs..."):

            @st.cache_data
            def generating_ndc_comparisons(selected_countries):
                prompt = f"Compare the NDCs of these countries: {selected_countries}"
                return top_agent.query(prompt)

            comparison_response = generating_ndc_comparisons(tuple(state.ndc_comparison))
            # comparison_response = top_agent.query(countries_ndc_comparison_query_prompt)
            with st.expander("AI comparison of chosen NDCs. <click here to expand>"):
                st.markdown(f"{comparison_response}")
    else:
        st.info("Select countries from the list above to compare their NDCs.")


with ncqg_tab:
    st.subheader("New Collective Quantified Goal (NCQG)")
    st.markdown("NCQG are to be submitted by February 2025.")
    st.markdown("Plese find more information [here](https://unfccc.int/NCQG).")

with action_tab:
    st.subheader("Take Action Now!")
    st.text(
        "This section has NOT been implemented yet. It is under active development."
    )
    st.markdown(
        "To take action, we will be sending emails to public representatives in your country!"
    )
    country = st.selectbox("First, select your country", countries_list())
    st.markdown(
        f"Click the button below to send emails to ALL your public representatives in {country}!"
    )

    if st.button("💻 Make a Difference! 🧿"):
        st.success(
            "🦹 Under development"
        )  # Placeholder for future functionality: Emails sent successfully!
        st.balloons()
