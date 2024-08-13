import requests
from io import BytesIO
from PIL import Image


# Function to display an image from a URL in Streamlit
def display_image_from_url(image_url):
    # Load the image from the URL
    response = requests.get(image_url)
    img = Image.open(BytesIO(response.content))

    return img
