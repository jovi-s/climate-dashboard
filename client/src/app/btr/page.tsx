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
import { Spinner } from '@/components/ui/spinner';

export default function BTR() {
  const [selectedCountry, setSelectedCountry] = useState("Singapore");
  const [initialized, setInitialized] = useState(false);
  const [loading, setLoading] = useState(false); // New loading state

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
            onClick={async () => {
              setInitialized(false); // Reset initialization state
              await handleInitialize(); // Wait for the initialization to complete
            }}
            disabled={!selectedCountry || initialized || loading} // Disable if loading
            className="ml-4"
          >
            {initialized ? "Pipeline Initialized!" : "Click here to load report!"}
          </Button>
          {loading && ( // Show spinner when loading
            <div className="ml-2 inline-block">
              <Spinner />
            </div>
          )}

          <div className="ml-10" />
          <a
            href="https://www.nccs.gov.sg/files/docs/default-source/publications/Singapore_s_First_Biennial_Transparency_Report_2024__LR_.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            Click here to view Singapore&apos;s complete BTR
          </a>
        </div>

        <Chat />
      </div>
    </section>
  );}
