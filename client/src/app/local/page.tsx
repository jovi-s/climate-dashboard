"use client";

import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


export default function Local() {
  const [selectedCountry, setSelectedCountry] = useState("singapore");
  const [imageUrl, setImageUrl] = useState("");
  const [countryURL, setCountryURL] = useState("");  

  const countries = [
    "singapore",
    "argentina",
    "australia",
    "bhutan",
    "brazil",
    "canada",
    "chile",
    "china",
    "colombia",
    "costa-rica",
    "eu",
    "egypt",
    "ethiopia",
    "gabon",
    "germany",
    "india",
    "indonesia",
    "iran",
    "japan",
    "kazakhstan",
    "kenya",
    "mexico",
    "morocco",
    "nepal",
    "new-zealand",
    "nigeria",
    "norway",
    "peru",
    "philippines",
    "russian-federation",
    "saudi-arabia",
    "south-africa",
    "south-korea",
    "switzerland",
    "thailand",
    "gambia",
    "turkey",
    "uae",
    "usa",
    "ukraine",
    "uk",
    "vietnam",
];

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_PYTHON_BACKEND}/api/cat-summary?selected_local_country=${selectedCountry}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json(); // Convert the response to JSON
      })
      .then((data) => {
        setImageUrl(data.image_url);
        setCountryURL(data.country_url);
      })
      .catch(() => {
        setImageUrl("");
        setCountryURL("");
      });
  }, [selectedCountry]);

  return (
    <section className="p-8 min-h-screen bg-white">
      <div className="mt-16 max-w-4xl mx-auto">
        <h1 className="text-3xl text-gray-800 mb-6">
          Localized Climate Action Tracker Summary
        </h1>
        <label
          htmlFor="country-select"
          className="block mb-2 font-medium text-gray-700"
        >
          Select a country from the dropdown menu below to load its Climate Action Tracker overview
        </label>

        <Select onValueChange={setSelectedCountry}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a country" />
          </SelectTrigger>
          <SelectContent>
            {countries.map((country) => (
              <SelectItem key={country} value={country}>
                {country}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {imageUrl && (
          <div className="mt-6">
            <img src={imageUrl} alt={`${selectedCountry} Overview`} className="w-full rounded-lg" />
          </div>
        )}

        <p className="mt-6 text-gray-700">
          For more information, visit{" "}
          <a
            href={countryURL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            Climate Action Tracker
          </a>
          .
        </p>
      </div>
    </section>
  );
}