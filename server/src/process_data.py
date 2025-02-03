import pandas as pd

# ========================
# 1. CO₂ Data
# ========================


def clean_co2_data(text):
    """
    Clean the raw CO₂ data text and extract the plotting columns.
    Returns a dict with x and y values plus label information.
    """
    lines = text.splitlines()
    # Remove comment lines and split each line by whitespace
    data = [line.split() for line in lines if not line.startswith("#")]

    # Define the expected column names
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
    # Convert columns to numeric values
    df = df.apply(pd.to_numeric, errors="coerce")

    # Extract the two columns used for plotting:
    # x: "Decimal Date" and y: "Monthly Average"
    return {
        "x": df["Decimal Date"],
        "y": df["Monthly Average"],
        "x_label": "Year",  # what you want on the x-axis
        "y_label": "CO₂ (PPM)",  # what you want on the y-axis
    }


# ========================
# 2. Methane Data
# ========================


def clean_methane_data(text):
    """
    Clean the raw methane data text and extract the plotting columns.
    Returns a dict with x and y values plus label information.
    """
    lines = text.splitlines()
    data = [line.split() for line in lines if not line.startswith("#")]

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
    df = df.apply(pd.to_numeric, errors="coerce")
    df.dropna(how="all", inplace=True)

    # For methane, we also use "Decimal Date" for x and "Monthly Average" for y.
    return {
        "x": df["Decimal Date"],
        "y": df["Monthly Average"],
        "x_label": "Year",
        "y_label": "Atmospheric-Methane-(PPB)",
    }


# ========================
# 3. Global Temperature Anomaly
# ========================


def clean_global_temperature_anomaly(text):
    """
    Clean the global temperature anomaly data text.
    This data contains two y-series ("No_Smoothing" and "Lowess(5)").
    Returns a dict with x values and a sub-dict for the y series.
    """
    lines = text.splitlines()
    # Filter out unnecessary lines (dashes, empty lines, lines with 'Land-Ocean')
    filtered_lines = [
        line
        for line in lines
        if not (line.startswith("-") or len(line.strip()) == 0 or "Land-Ocean" in line)
    ]
    # Split the remaining lines by whitespace
    data = [line.split() for line in filtered_lines]

    # The first row is assumed to be the header
    columns = data[0]
    data_rows = data[1:]
    df = pd.DataFrame(data_rows, columns=columns)

    # Convert numeric columns appropriately
    df["No_Smoothing"] = pd.to_numeric(df["No_Smoothing"], errors="coerce")
    df["Lowess(5)"] = pd.to_numeric(df["Lowess(5)"], errors="coerce")
    df["Year"] = pd.to_numeric(df["Year"])

    return {
        "x": df["Year"],
        "ys": {"No Smoothing": df["No_Smoothing"], "Lowess(5)": df["Lowess(5)"]},
        "x_label": "Year",
        "y_label": "Temperature Anomaly w.r.t. 1951-80 (°C)",
    }


# ========================
# 4. World Ocean Warming
# ========================


def clean_world_ocean_warming(text):
    """
    Clean the world ocean warming data text.
    Returns a dict with the x values, y values, and error values for plotting.
    """
    lines = text.splitlines()
    data = [line.split() for line in lines]

    columns = ["YEAR", "WO", "WOse", "NH", "NHse", "SH", "SHse"]
    df = pd.DataFrame(data, columns=columns)
    df = df.apply(pd.to_numeric, errors="coerce")
    df.dropna(how="all", inplace=True)

    return {
        "x": df["YEAR"],
        "y": df["WO"],
        "yerr": df["WOse"],
        "x_label": "Year",
        "y_label": "Temperature Anomaly (°C)",
    }
