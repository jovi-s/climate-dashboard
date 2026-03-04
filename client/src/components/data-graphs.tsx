"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, BarChart2, Thermometer, Waves } from "lucide-react"

export default function GraphSection() {
  // State variables for each graph's image data URL and source text
  const [co2Src, setCo2Src] = useState<string | null>(null)
  const [co2Source, setCo2Source] = useState<string | null>(null)

  const [methaneSrc, setMethaneSrc] = useState<string | null>(null)
  const [methaneSource, setMethaneSource] = useState<string | null>(null)

  const [tempSrc, setTempSrc] = useState<string | null>(null)
  const [tempSource, setTempSource] = useState<string | null>(null)

  const [oceanSrc, setOceanSrc] = useState<string | null>(null)
  const [oceanSource, setOceanSource] = useState<string | null>(null)

  // State to manage the enlarged image (if any)
  const [enlargedImage, setEnlargedImage] = useState<{ src: string; alt: string } | null>(null)

  useEffect(() => {
    // A helper function that fetches an endpoint using Promise chains.
    function fetchGraph(endpoint: string, setImage: (src: string) => void, setSource: (src: string) => void): void {
      fetch(endpoint)
        .then((res) => {
          if (!res.ok) {
            throw new Error(`Failed to fetch ${endpoint}`)
          }
          return res.json()
        })
        .then((data) => {
          const dataURL = `data:image/png;base64,${data.image}`
          setImage(dataURL)
          setSource(data.source)
        })
        .catch((err) => {
          console.error(err)
        })
    }

    // Fetch each graph from its endpoint
    fetchGraph(`${process.env.NEXT_PUBLIC_PYTHON_BACKEND}/plot/co2`, setCo2Src, setCo2Source)
    fetchGraph(`${process.env.NEXT_PUBLIC_PYTHON_BACKEND}/plot/methane`, setMethaneSrc, setMethaneSource)
    fetchGraph(`${process.env.NEXT_PUBLIC_PYTHON_BACKEND}/plot/temperature-anomaly`, setTempSrc, setTempSource)
    fetchGraph(`${process.env.NEXT_PUBLIC_PYTHON_BACKEND}/plot/ocean-warming`, setOceanSrc, setOceanSource)
  }, [])

  const graphItems = [
    {
      title: "Carbon Dioxide Levels Over Time",
      src: co2Src,
      alt: "CO2 Graph",
      source: co2Source,
      icon: LineChart,
      loading: "Loading CO₂ graph...",
    },
    {
      title: "Methane Levels Over Time",
      src: methaneSrc,
      alt: "Methane Graph",
      source: methaneSource,
      icon: BarChart2,
      loading: "Loading Methane graph...",
    },
    {
      title: "Global Temperature Anomalies",
      src: tempSrc,
      alt: "Temperature Anomaly Graph",
      source: tempSource,
      icon: Thermometer,
      loading: "Loading Temperature graph...",
    },
    {
      title: "World Ocean Warming",
      src: oceanSrc,
      alt: "World Ocean Warming Graph",
      source: oceanSource,
      icon: Waves,
      loading: "Loading Ocean warming graph...",
    },
  ]

  return (
    <section id="graphs" className="w-full py-12 md:py-24 lg:py-32 bg-background">
      <div className="container px-4 md:px-6 mx-auto">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">
          Climate Data Charts
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {graphItems.map((item, index) => (
            <Card key={index} className="overflow-hidden border-none shadow-lg">
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <item.icon className="h-8 w-8 text-blue-600" />
                <CardTitle>{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                {item.src ? (
                  <div className="relative">
                    <div className="overflow-hidden rounded-lg">
                      <Image
                        src={item.src || "/placeholder.svg"}
                        alt={item.alt}
                        width={500}
                        height={300}
                        layout="responsive"
                        className="transition-transform hover:scale-105 cursor-pointer"
                        onClick={() => setEnlargedImage({ src: item.src!, alt: item.alt })}
                      />
                    </div>
                    <p className="text-xs text-center mt-2 text-muted-foreground">{item.source}</p>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-48 bg-muted rounded-lg">
                    <p className="text-muted-foreground">{item.loading}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Modal overlay for the enlarged image */}
      {enlargedImage && (
        <div
          onClick={() => setEnlargedImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm"
        >
          <div className="relative max-w-4xl max-h-[90vh] overflow-auto p-2">
            <button
              onClick={() => setEnlargedImage(null)}
              className="absolute top-4 right-4 bg-white/20 text-white rounded-full p-2 hover:bg-white/30 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <Image
              src={enlargedImage.src || "/placeholder.svg"}
              alt={enlargedImage.alt}
              width={1200}
              height={800}
              className="rounded-lg"
            />
          </div>
        </div>
      )}
    </section>
  )
}

