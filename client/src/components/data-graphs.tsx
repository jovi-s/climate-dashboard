"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function GraphSection() {
  // State variables for each graph's image data URL and source text
  const [co2Src, setCo2Src] = useState<string | null>(null);
  const [co2Source, setCo2Source] = useState<string | null>(null);

  const [methaneSrc, setMethaneSrc] = useState<string | null>(null);
  const [methaneSource, setMethaneSource] = useState<string | null>(null);

  const [tempSrc, setTempSrc] = useState<string | null>(null);
  const [tempSource, setTempSource] = useState<string | null>(null);

  const [oceanSrc, setOceanSrc] = useState<string | null>(null);
  const [oceanSource, setOceanSource] = useState<string | null>(null);

  // State to manage the enlarged image (if any)
  const [enlargedImage, setEnlargedImage] = useState<{ src: string; alt: string } | null>(null);

//   useEffect(() => {
//     // Helper function to fetch the graph data
//     async function fetchGraph(
//       endpoint: string,
//       setImage: (src: string) => void,
//       setSource: (src: string) => void
//     ): Promise<void> {
//       try {
//         const res = await fetch(endpoint);
//         if (!res.ok) {
//           throw new Error(`Failed to fetch ${endpoint}`);
//         }
//         const data = await res.json();
//         const dataURL = `data:image/png;base64,${data.image}`;
//         setImage(dataURL);
//         setSource(data.source);
//       } catch (err) {
//         console.error(err);
//       }
//     }

    useEffect(() => {
    // A helper function that fetches an endpoint using Promise chains.
    function fetchGraph(
        endpoint: string,
        setImage: (src: string) => void,
        setSource: (src: string) => void
    ): void {
        fetch(endpoint)
        .then((res) => {
            if (!res.ok) {
            throw new Error(`Failed to fetch ${endpoint}`);
            }
            return res.json();
        })
        .then((data) => {
            const dataURL = `data:image/png;base64,${data.image}`;
            setImage(dataURL);
            setSource(data.source);
        })
        .catch((err) => {
            console.error(err);
        });
    }

    // Fetch each graph from its endpoint
    fetchGraph(`${process.env.NEXT_PUBLIC_PYTHON_BACKEND}/plot/co2`, setCo2Src, setCo2Source);
    fetchGraph(`${process.env.NEXT_PUBLIC_PYTHON_BACKEND}/plot/methane`, setMethaneSrc, setMethaneSource);
    fetchGraph(`${process.env.NEXT_PUBLIC_PYTHON_BACKEND}/plot/temperature-anomaly`, setTempSrc, setTempSource);
    fetchGraph(`${process.env.NEXT_PUBLIC_PYTHON_BACKEND}/plot/ocean-warming`, setOceanSrc, setOceanSource);
  }, []);

  return (
    <section id="graphs" className="p-8 sm:p-20 bg-white">
      <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8">Graphs</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {co2Src ? (
          <Card>
            <CardHeader>
              <CardTitle>Carbon Dioxide Levels Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <Image
                src={co2Src}
                alt="CO2 Graph"
                layout="responsive"
                width={500}
                height={300}
                onClick={() => setEnlargedImage({ src: co2Src, alt: "CO2 Graph" })}
                style={{ cursor: "pointer" }}
              />
              {/* <img 
                src={co2Src} 
                alt="CO2 Graph" 
                onClick={() => setEnlargedImage({ src: co2Src, alt: "CO2 Graph" })} 
                style={{ cursor: "pointer" }} 
              /> */}
              <p className="text-xs text-center mt-2">{co2Source}</p>
            </CardContent>
          </Card>
        ) : (
          <div>Loading CO₂ graph...</div>
        )}

        {methaneSrc ? (
          <Card>
            <CardHeader>
              <CardTitle>Methane Levels Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <Image
                src={methaneSrc}
                alt="Methane Graph"
                layout="responsive"
                width={500}
                height={300}
                onClick={() => setEnlargedImage({ src: methaneSrc, alt: "Methane Graph" })}
                style={{ cursor: "pointer" }}
              />
              <p className="text-xs text-center mt-2">{methaneSource}</p>
            </CardContent>
          </Card>
        ) : (
          <div>Loading Methane graph...</div>
        )}

        {tempSrc ? (
          <Card>
            <CardHeader>
              <CardTitle>Global Temperature Anomalies</CardTitle>
            </CardHeader>
            <CardContent>
              <Image
                src={tempSrc}
                alt="Temperature Anomaly Graph"
                layout="responsive"
                width={500}
                height={300}
                onClick={() => setEnlargedImage({ src: tempSrc, alt: "Temperature Anomaly Graph" })}
                style={{ cursor: "pointer" }}
              />
              <p className="text-xs text-center mt-2">{tempSource}</p>
            </CardContent>
          </Card>
        ) : (
          <div>Loading Temperature graph...</div>
        )}

        {oceanSrc ? (
          <Card>
            <CardHeader>
              <CardTitle>World Ocean Warming</CardTitle>
            </CardHeader>
            <CardContent>
              <Image
                src={oceanSrc}
                alt="World Ocean Warming Graph"
                layout="responsive"
                width={500}
                height={300}
                onClick={() => setEnlargedImage({ src: oceanSrc, alt: "World Ocean Warming Graph" })}
                style={{ cursor: "pointer" }}
              />
              <p className="text-xs text-center mt-2">{oceanSource}</p>
            </CardContent>
          </Card>
        ) : (
          <div>Loading Ocean warming graph...</div>
        )}
      </div>

      {/* Modal overlay for the enlarged image */}
      {enlargedImage && (
        <div
          onClick={() => setEnlargedImage(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <Image
            src={enlargedImage.src}
            alt={enlargedImage.alt}
            layout="intrinsic"
            width={900}
            height={900}
            style={{ maxWidth: "90%", maxHeight: "90%" }}
          />
        </div>
      )}
    </section>
  );
}