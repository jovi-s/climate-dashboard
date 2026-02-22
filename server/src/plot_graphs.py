import ast

import matplotlib.pyplot as plt
import pandas as pd


def plot_co2_data(text):
    lines = text.splitlines()

    # Remove comment lines (those that start with '#') and split by whitespace
    data = [line.split() for line in lines if not line.startswith("#")]

    # Convert to a DataFrame
    columns = [
        "Year",
        "Month",
        "Decimal Date",
        "Monthly Average",
        "De-seasonalized",
        "#Days",
        "Standard Deviation",
        "Uncertainty of Monthly Mean",
    ]
    df = pd.DataFrame(data, columns=columns)

    # Convert numeric columns to appropriate data types
    df = df.apply(pd.to_numeric, errors="coerce")

    # Plotting the data
    fig, ax = plt.subplots(figsize=(5, 3))
    ax.plot(df["Decimal Date"], df["Monthly Average"], label="CO2 (PPM)")
    ax.set_title("Carbon Dioxide (PPM) over Time")
    ax.set_xlabel("Year")
    ax.set_ylabel("CO2 (PPM)")
    ax.grid(True)

    # Return the *Figure*, not `plt`
    return fig


def plot_methane_data(text):
    lines = text.splitlines()

    # Remove comment lines (those that start with '#') and split by whitespace
    data = [line.split() for line in lines if not line.startswith("#")]

    # Convert to a DataFrame
    columns = [
        "Year",
        "Month",
        "Decimal Date",
        "Monthly Average",
        "Average Uncertainty",
        "Trend",
        "Trend Uncertainty",
    ]
    df = pd.DataFrame(data, columns=columns)

    # Convert numeric columns to appropriate data types
    df = df.apply(pd.to_numeric, errors="coerce")

    # Drop rows where all elements are NaN (which might happen if the line was empty)
    df.dropna(how="all", inplace=True)

    # Plotting the data
    fig, ax = plt.subplots(figsize=(5, 3))
    ax.plot(df["Decimal Date"], df["Monthly Average"], label="CO2 (PPM)")
    ax.set_title("Atmospheric-Methane-(PPB) over Time")
    ax.set_xlabel("Year")
    ax.set_ylabel("Atmospheric-Methane-(PPB)")
    ax.grid(True)

    return fig


def global_temperature_anomaly(text):
    lines = text.splitlines()

    # Step 1: Filter out unnecessary lines
    filtered_lines = [
        line
        for line in lines
        if not (line.startswith("-") or len(line.strip()) == 0 or "Land-Ocean" in line)
    ]

    # Step 2: Split the remaining lines by whitespace
    data = [line.split() for line in filtered_lines]

    # Step 3: Extract the headers and data separately
    columns = data[0]  # Extract the header row
    data_rows = data[1:]  # All rows after the header

    # Step 4: Convert to a DataFrame
    df = pd.DataFrame(data_rows, columns=columns)

    # Convert numeric columns to floats
    df["No_Smoothing"] = pd.to_numeric(df["No_Smoothing"], errors="coerce")
    df["Lowess(5)"] = pd.to_numeric(df["Lowess(5)"], errors="coerce")
    # Convert the 'Year' column to numeric to ensure proper plotting
    df["Year"] = pd.to_numeric(df["Year"])

    # Combined Plot
    fig, ax = plt.subplots(figsize=(5, 3))
    ax.plot(df["Year"], df["No_Smoothing"], label="No Smoothing", color="blue")
    ax.plot(df["Year"], df["Lowess(5)"], label="Lowess(5)", color="red")
    ax.set_title("Global Land-Ocean Temperature Index (Comparison)")
    ax.set_xlabel("Year")
    ax.set_ylabel("Temperature Anomaly w.r.t. 1951-80 (°C)")
    ax.grid(True)
    return fig


def plot_world_ocean_warming(text):
    lines = text.splitlines()

    # Step 2: Split the remaining lines by whitespace
    data = [line.split() for line in lines]

    columns = ["YEAR", "WO", "WOse", "NH", "NHse", "SH", "SHse"]
    df = pd.DataFrame(data, columns=columns)

    # Convert numeric columns to appropriate data types
    df = df.apply(pd.to_numeric, errors="coerce")

    # Drop rows where all elements are NaN (which might happen if the line was empty)
    df.dropna(how="all", inplace=True)

    # Plotting World Ocean Warming
    fig, ax = plt.subplots(figsize=(5, 3))
    ax.errorbar(
        df["YEAR"],
        df["WO"],
        yerr=df["WOse"],
        label="World Ocean (WO)",
        fmt="-o",
        capsize=5,
        color="blue",
    )
    ax.set_title("World Ocean Warming Over Time")
    ax.set_xlabel("Year")
    ax.set_ylabel("Temperature Anomaly (°C)")
    ax.grid(True)
    # plt.legend()

    return fig


# def plot_world_ocean_warming_1992(text):
#     data = ast.literal_eval(text)
#     # Convert the dictionary into a DataFrame
#     df = pd.DataFrame(data.items(), columns=["Date", "Temperature"])

#     # Convert 'Date' column to datetime format
#     df["Date"] = pd.to_datetime(df["Date"])

#     # Plotting World Ocean Warming
#     fig, ax = plt.subplots(figsize=(10, 5))
#     ax.plot(
#         df["Date"],
#         df["Temperature"],
#         label="World Ocean Temperature",
#         marker="o",
#         color="blue",
#     )
#     ax.set_title("World Ocean Warming Over Time")
#     ax.set_xlabel("Date")
#     ax.set_ylabel("Ocean Heat Content (Zettajoules)")
#     ax.grid(True)
#     # ax.legend()

#     return fig
