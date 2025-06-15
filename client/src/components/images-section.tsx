"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Camera, X } from "lucide-react"

type ImageData = {
  title: string
  url: string
  source: string
}

const IMAGES = {
  "Climate Data": [],
}

const fetchImages = async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_PYTHON_BACKEND}/images/url-links`)
  if (!response.ok) {
    throw new Error("Failed to fetch images")
  }
  const data = await response.json()
  return data
}

const ClimateImages = () => {
  const [images, setImages] = useState(IMAGES)
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null)

  useEffect(() => {
    const loadImages = async () => {
      try {
        const fetchedImages = await fetchImages()
        setImages(fetchedImages)
      } catch (error) {
        console.error(error)
      }
    }

    loadImages()
  }, [])

  const handleImageClick = (image: ImageData) => {
    setSelectedImage(image)
  }

  const closeModal = () => {
    setSelectedImage(null)
  }

  return (
    <section id="images" className="w-full py-12 md:py-24 lg:py-32 bg-background">
      <div className="container px-4 md:px-6 mx-auto">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">
          Climate Imagery
        </h2>

        {Object.entries(images).map(([category, images]) => (
          <div key={category} className="mb-10">
            {images.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {images.map((image: ImageData) => (
                  <Card
                    key={image.title}
                    className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow cursor-pointer group"
                    onClick={() => handleImageClick(image)}
                  >
                    <CardContent className="p-0">
                      <div className="relative">
                        <div className="aspect-[4/3] overflow-hidden">
                          <Image
                            src={image.url || "/placeholder.svg"}
                            alt={image.title}
                            width={500}
                            height={375}
                            className="object-cover w-full h-full transition-transform group-hover:scale-105"
                          />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end">
                          <div className="p-4 text-white w-full">
                            <h3 className="font-medium text-lg">{image.title}</h3>
                            <p className="text-sm text-white/80">{image.source}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-48 bg-gray-100 rounded-lg">
                <Camera className="h-12 w-12 text-gray-400 mb-2" />
                <p className="text-gray-500">No images available</p>
              </div>
            )}
          </div>
        ))}

        {selectedImage && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 backdrop-blur-sm"
            onClick={closeModal}
          >
            <div
              className="relative bg-white rounded-lg shadow-2xl max-w-4xl max-h-[90vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 bg-white rounded-full p-2 shadow-md z-10"
                onClick={closeModal}
              >
                <X className="h-5 w-5" />
              </button>
              <div className="p-1">
                <Image
                  src={selectedImage.url || "/placeholder.svg"}
                  alt={selectedImage.title}
                  width={1000}
                  height={600}
                  className="rounded-t-lg"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{selectedImage.title}</h3>
                <p className="text-sm text-gray-600">{selectedImage.source}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default ClimateImages

