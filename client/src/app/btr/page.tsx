"use client";

import { useState } from "react";
import * as React from "react";
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
      // Optionally clear previous chat messages when switching countries.
      // setMessages([]);
    } catch (error) {
      console.error("Error initializing BTR RAG agent:", error);
    }
  };

  return (
    <section className="p-8 min-h-screen bg-white">
      <div className="mt-16 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          AI Chatbot with UNFCCC Biennial Transparency Reports (BTR)
        </h1>
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
          <Button
            onClick={handleInitialize}
            disabled={!selectedCountry || initialized}
            className="ml-4"
          >
            {initialized ? "Pipeline Initialized!" : "Click here to load report!"}
          </Button>
        </div>

        <Chat />
      </div>
    </section>
  );}
