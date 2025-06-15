"use client"

import { useEffect, useState } from "react"
import ReactMarkdown from "react-markdown"
import rehypeRaw from "rehype-raw"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"
import NDCTracker from "@/components/ndc-tracker"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Create a reusable component that replaces your MultiSelect.
type DropdownMenuCheckboxesProps = {
  options: string[]
  selected: string[]
  onChange: (selected: string[]) => void
}

function DropdownMenuCheckboxes({ options, selected, onChange }: DropdownMenuCheckboxesProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full md:w-auto">
          {selected.length > 0 ? selected.join(", ") : "Select countries..."}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Select Countries</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {options.map((option) => (
          <DropdownMenuCheckboxItem
            key={option}
            checked={selected.includes(option)}
            onCheckedChange={(checked: boolean) => {
              if (checked) {
                onChange([...selected, option])
              } else {
                onChange(selected.filter((c) => c !== option))
              }
            }}
          >
            {option}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function SkeletonCard() {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-[125px] w-[250px] rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  )
}

export default function NDCs() {
  const [selectedCountries, setSelectedCountries] = useState<string[]>([])
  const [summary, setSummary] = useState("Loading...")
  const [summary2, setSummary2] = useState("Loading...")
  const [apiText, setApiText] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("apiText") || ""
    }
    return ""
  })
  const [isLoading, setIsLoading] = useState(false)

  const countries = [
    "Cambodia",
    "Myanmar",
    "Laos",
    "Singapore",
    "Brunei",
    "Vietnam",
    "Malaysia",
    "Indonesia",
    "Thailand",
    "Philippines",
  ]

  // Fetch the summary text when the component mounts
  useEffect(() => {
    fetch("/assets/Singapore_1NDC_2Update_Summary.md")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok")
        }
        return response.text()
      })
      .then((data) => setSummary(data))
      .catch(() => setSummary("Failed to load summary."))
  }, [])

  useEffect(() => {
    fetch("/assets/Singapore_2NDC_Summary.md")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok")
        }
        return response.text()
      })
      .then((data) => setSummary2(data))
      .catch(() => setSummary2("Failed to load summary."))
  }, [])

  // Handler for running the analysis on button click
  const handleRunAnalysis = async () => {
    // Validate that at least 2 countries are selected
    if (selectedCountries.length < 2) {
      alert("Please select at least 2 countries for comparison.")
      return
    }

    setIsLoading(true)
    try {
      // Join the selected countries into a comma-separated string
      const query = selectedCountries.join(",")
      const url = `${process.env.NEXT_PUBLIC_PYTHON_BACKEND}/api/ndc-comparison?selected_countries=${encodeURIComponent(
        query,
      )}`

      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      const data = await response.json()
      setApiText(data.text)
      localStorage.setItem("apiText", data.text) // Save to localStorage
    } catch (error) {
      console.error("Error fetching data:", error)
      setApiText("Error fetching analysis.")
      localStorage.setItem("apiText", "Error fetching analysis.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="p-8 min-h-screen bg-background">
      <div className="mt-16 max-w-4xl mx-auto">
        <div className="mb-12">
          <NDCTracker />
        </div>
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 tracking-tight">
            AI Summarizations of Singapore&apos;s Nationally Determined Contributions (NDCs)
          </h2>
          <p className="text-gray-700 leading-relaxed">
            View an AI-generated summary of Singapore&apos;s <strong>2nd NDC (2025)</strong>. For more details, refer to
            the official document{" "}
            <a
              href="https://www.nccs.gov.sg/files/docs/default-source/news-documents/Singapore_Second_Nationally_Determined_Contribution.pdf"
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
              <ReactMarkdown rehypePlugins={[rehypeRaw]}>{summary2}</ReactMarkdown>
            </div>
          </details>
          <p className="text-gray-700 leading-relaxed mt-6">
            View an AI-generated summary of Singapore&apos;s <strong>2nd Update of its 1st NDC (2022)</strong>. For more
            details, refer to the official document{" "}
            <a
              href="https://unfccc.int/sites/default/files/NDC/2022-11/Singapore%20Second%20Update%20of%20First%20NDC.pdf"
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
        </div>

        <div className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 tracking-tight">An AI comparative analysis of NDCs</h2>
          <p className="text-gray-700 mb-6 leading-relaxed">
            This section performs a comparative analysis of NDCs of countries in the South East Asia (SEA) region using
            generative AI. Countries available for NDC analysis:
            <strong> Cambodia, Myanmar, Laos, Singapore, Brunei, Vietnam, Malaysia, Indonesia</strong>.
          </p>
          <label htmlFor="country-select" className="block mb-2 font-medium text-gray-700">
            Select at least 2 SEA countries to compare their NDCs:
          </label>
          <div className="max-w-4xl mx-auto">
            <DropdownMenuCheckboxes options={countries} selected={selectedCountries} onChange={setSelectedCountries} />
          </div>

          {/* Button section: Conditionally render the button based on the loading state */}
          <div className="mt-4">
            {isLoading ? (
              <Button disabled className="bg-blue-600 hover:bg-blue-700">
                <Loader2 className="animate-spin mr-2" />
                Please wait
              </Button>
            ) : (
              <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleRunAnalysis}>
                Click here to run analysis!
              </Button>
            )}
          </div>

          {/* AI Response section */}
          <div className="mt-8">
            {isLoading ? (
              <SkeletonCard />
            ) : (
              <Card className="mb-7 flex min-h-[564px] w-full min-w-fit rounded-lg border-none shadow-md px-5 py-4 font-medium">
                <ReactMarkdown className="prose prose-blue max-w-none">
                  {apiText ? apiText : "AI generated response will appear here..."}
                </ReactMarkdown>
              </Card>
            )}
          </div>
          <div className="flex justify-end">
            <Button
              variant="outline"
              className="border-gray-200 hover:bg-gray-50 text-gray-700"
              onClick={() => setApiText("")}
            >
              Clear AI Response
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

