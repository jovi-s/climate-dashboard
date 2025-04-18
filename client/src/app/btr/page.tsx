"use client";

import { useState, useEffect } from "react";
import * as React from "react";
import ReactMarkdown from "react-markdown"
import rehypeRaw from "rehype-raw"
import { Loader2 } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Chat } from "@/components/chat";
import { Button } from "@/components/ui/button";

export default function BTR() {
  const [selectedCountry, setSelectedCountry] = useState("Singapore");
  const [initialized, setInitialized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState("Loading...")

  // Fetch the summary text when the component mounts
  useEffect(() => {
    fetch("/assets/Singapore_BTR_Summary.md")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok")
        }
        return response.text()
      })
      .then((data) => setSummary(data))
      .catch(() => setSummary("Failed to load summary."))
  }, [])

  const countries = [
    "Singapore",
    // Add more countries as needed.
    // "Cambodia",
    // "Myanmar",
    // "Laos",
    // "Brunei",
    // "Vietnam",
    // "Malaysia",
    // "Indonesia",
  ];

  // This function is called when the user presses the initialization button.
  const handleInitialize = async () => {
    if (!selectedCountry) return;

    setLoading(true); // Set loading to true when starting the initialization

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_PYTHON_BACKEND}/api/initialize-btr-rag?btr_rag_country=${encodeURIComponent(
          selectedCountry
        )}`,
        {
          method: "GET",
        }
      );
      if (!res.ok) {
        throw new Error("Initialization failed");
      }
      const data = await res.json();
      console.log(data.message);
      setInitialized(true);
    } catch (error) {
      console.error("Error initializing BTR RAG agent:", error);
    } finally {
      setLoading(false); // Set loading to false when done
    }
  };

  return (
    <section className="p-8 min-h-screen bg-white">
      <div className="mt-16 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 tracking-tight">
          AI Analysis of Singapore&apos;s Biennial Transparency Report (BTR)
        </h2>
        <p className="text-gray-700 leading-relaxed">
          View an AI-generated summary of Singapore&apos;s <strong>2024 BTR</strong>. For more details, refer to
          the official document{" "}
          <a
            href="https://www.nccs.gov.sg/files/docs/default-source/publications/Singapore_s_First_Biennial_Transparency_Report_2024__LR_.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            here
          </a>
          .
        </p>
        <details className="border border-gray-200 p-4 rounded-lg mt-4 shadow-sm">
          <summary className="cursor-pointer text-blue-600 font-medium">
            <span>Click here to expand</span>
          </summary>
          <div className="prose prose-blue max-w-none mt-4">
            <ReactMarkdown rehypePlugins={[rehypeRaw]}>{summary}</ReactMarkdown>
          </div>
        </details>

        <div className="mt-12">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            AI Chatbot with UNFCCC Biennial Transparency Reports (BTR)
          </h1>
        </div>
        <p className="text-gray-700 mb-6">
          Please find more information about BTRs{" "}
          <a
            href="https://unfccc.int/first-biennial-transparency-reports"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            here
          </a>
          .
        </p>

        <label
          htmlFor="country-select"
          className="block mb-2 font-medium text-gray-700"
        >
          Select a country ⬇️ to chat with its BTR (Please load the report before commencing to chat)
        </label>

        <div className="max-w-4xl mx-auto mb-6 flex items-center">
          <Select
            onValueChange={(value) => {
              setSelectedCountry(value);
              // Reset the initialization state when switching countries.
              setInitialized(false);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Singapore" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>South East Asia</SelectLabel>
                {countries.map((country) => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {loading ? (
            <Button disabled className="ml-4 bg-blue-600 hover:bg-blue-700">
              <Loader2 className="animate-spin mr-2" />
              Please wait
            </Button>
          ) : (
            <Button 
              onClick={async () => {
                setInitialized(false); // Reset initialization state
                await handleInitialize(); // Wait for the initialization to complete
              }}
              disabled={!selectedCountry || initialized} 
              className="ml-4 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {initialized ? "Pipeline Initialized!" : "Click here to load report!"}
            </Button>
          )}
        </div>
        <Chat />
      </div>
    </section>
  );}
