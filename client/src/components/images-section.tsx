import Image from "next/image";
import { useEffect, useState } from "react";

type ImageData = {
  title: string;
  url: string;
  source: string;
};

const IMAGES = {
  "Climate Data": [],
};

const fetchImages = async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_PYTHON_BACKEND}/images/url-links`);
  if (!response.ok) {
    throw new Error("Failed to fetch images");
  }
  const data = await response.json();
  return data;
};

const ClimateImages = () => {
  const [images, setImages] = useState(IMAGES);
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);

  useEffect(() => {
    const loadImages = async () => {
      try {
        const fetchedImages = await fetchImages();
        setImages(fetchedImages);
      } catch (error) {
        console.error(error);
      }
    };

    loadImages();
  }, []);

  const handleImageClick = (image: ImageData) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="p-4">
      <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8">Online Images</h2>
      {Object.entries(images).map(([category, images]) => (
        <div key={category} className="mb-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {images.map((image: ImageData) => (
              <div
                key={image.title}
                className="p-2 bg-gray-100 rounded-lg shadow-md cursor-pointer"
                onClick={() => handleImageClick(image)}
              >
                <p className="font-medium mt-2">{image.title}</p>
                <Image
                  src={image.url}
                  alt={image.title}
                  width={500}
                  height={300}
                  className="rounded-lg"
                />
                <p className="text-sm text-gray-600">{image.source}</p>
              </div>
            ))}
          </div>
        </div>
      ))}

      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
          onClick={closeModal}
        >
          <div
            className="relative bg-white p-4 rounded-lg shadow-lg"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
          >
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              onClick={closeModal}
            >
              ✕
            </button>
            <Image
              src={selectedImage.url}
              alt={selectedImage.title}
              width={1000}
              height={600}
              className="rounded-lg"
            />
            <h3 className="mt-4 text-lg font-bold">{selectedImage.title}</h3>
            <p className="text-sm text-gray-600">{selectedImage.source}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClimateImages;
