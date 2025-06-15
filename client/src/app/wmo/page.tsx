"use client"

import { useState, useEffect } from "react"
import ReactMarkdown from "react-markdown"
import rehypeRaw from "rehype-raw"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import {
  FileText,
  Clock,
  BookOpen,
  Search,
  ChevronRight,
  Globe,
} from "lucide-react"

// Sample document metadata
const documents = [
  {
    id: "wmo-report-2024",
    title: "WMO State of the Global Climate 2024",
    description: "AI generated summary of the comprehensive report on the state of the global climate in 2024",
    icon: Globe,
    category: "Report",
    readTime: "10 min read",
    lastUpdated: "2025-05-19",
    filename: "wmo_2024.md",
    originalUrl: "https://wmo.int/publication-series/state-of-global-climate-2024",
  },
  {
    id: "wmo-report-2023",
    title: "WMO State of the Global Climate 2023",
    description: "AI generated summary of the comprehensive report on the state of the global climate in 2023",
    icon: Globe,
    category: "Report",
    readTime: "10 min read",
    lastUpdated: "2024-03-19",
    filename: "wmo_2023.md",
    originalUrl: "https://wmo.int/publication-series/state-of-global-climate-2023",
  },
  {
    id: "wmo-report-2022",
    title: "WMO State of the Global Climate 2022",
    description: "AI generated summary of the comprehensive report on the state of the global climate in 2022",
    icon: Globe,
    category: "Report",
    readTime: "10 min read",
    lastUpdated: "2023-04-23",
    filename: "wmo_2022.md",
    originalUrl: "https://wmo.int/publication-series/state-of-global-climate-2022",
  },
  {
    id: "wmo-report-2021",
    title: "WMO State of the Global Climate 2021",
    description: "AI generated summary of the comprehensive report on the state of the global climate in 2021",
    icon: Globe,
    category: "Report",
    readTime: "10 min read",
    lastUpdated: "2022-05-18",
    filename: "wmo_2021.md",
    originalUrl: "https://wmo.int/publication-series/state-of-global-climate-2021",
  },
  {
    id: "wmo-report-2020",
    title: "WMO State of the Global Climate 2020",
    description: "AI generated summary of the comprehensive report on the state of the global climate in 2020",
    icon: Globe,
    category: "Report",
    readTime: "10 min read",
    lastUpdated: "2021-04-19",
    filename: "wmo_2020.md",
    originalUrl: "https://wmo.int/publication-series/state-of-global-climate-2020",
  },
]

// Utility to fetch markdown content from public/assets/wmo_reports_pdf_summary
async function fetchMarkdown(filename: string): Promise<string> {
  // In Next.js, fetch from /public via fetch
  const res = await fetch(`/assets/wmo_reports_pdf_summary/${filename}`)
  if (!res.ok) return "Document not found"
  return await res.text()
}

export default function DocumentsPage() {
  const [activeDocument, setActiveDocument] = useState(documents[0].id)
  const [searchTerm, setSearchTerm] = useState("")
  const [documentContent, setDocumentContent] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [summary, setSummary] = useState<string>("Loading...")

  // Load all document markdowns
  useEffect(() => {
    const loadDocuments = async () => {
      setLoading(true)
      const content: Record<string, string> = {}
      await Promise.all(
        documents.map(async (doc) => {
          content[doc.id] = await fetchMarkdown(doc.filename)
        })
      )
      setDocumentContent(content)
      setLoading(false)
    }

    loadDocuments()
  }, [])

  // Fetch overall summary markdown
  useEffect(() => {
    let mounted = true
    fetch("/assets/wmo_reports_pdf_summary/overall_summary.md")
      .then((res) => (res.ok ? res.text() : "Summary not found"))
      .then((text) => {
        if (mounted) setSummary(text)
      })
    return () => {
      mounted = false
    }
  }, [])

  const filteredDocuments = documents.filter(
    (doc) =>
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 text-white">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm backdrop-blur-sm">
              World Meteorological Organization
            </div>
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
              State of the Global Climate Documentation Hub
            </h1>
            <p className="mx-auto max-w-[700px] text-white/80 md:text-xl">
              Comprehensive AI generated summaries from 2020 to 2024
            </p>
          </div>
        </div>
      </section>

    {/* Overall Summary */}
      <div className="container px-4 md:px-6 mx-auto -mt-16">
        <Card className="border-none shadow-xl mb-12">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-blue-600" />
              2020 - 2024 State of the Global Climate Summary
            </CardTitle>
            <CardDescription>
              AI generated summary of the WMO reports from 2020 to 2024, highlighting key findings and trends in global climate change.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose prose-blue max-w-none">
              <ReactMarkdown rehypePlugins={[rehypeRaw]}>
              {summary}
              </ReactMarkdown>
            </div>
          </CardContent>
        </Card>

        {/* Search and Filter */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        {/* Document Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredDocuments.map((doc) => {
            const IconComponent = doc.icon
            return (
              <Card
                key={doc.id}
                className={`cursor-pointer transition-all hover:shadow-lg border-none shadow-md ${
                  activeDocument === doc.id ? "ring-2 ring-blue-500 bg-blue-50" : ""
                }`}
                onClick={() => setActiveDocument(doc.id)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <IconComponent className="h-8 w-8 text-blue-600" />
                    <Badge variant="secondary">{doc.category}</Badge>
                  </div>
                  <CardTitle className={`text-lg ${
                    activeDocument === doc.id ? "text-black" : "text-foreground dark:text-foreground"
                  }`}>{doc.title}</CardTitle>
                  <CardDescription className="text-sm">{doc.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {doc.readTime}
                    </div>
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Document Content */}
        <Card className="border-none shadow-lg mb-12">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <FileText className="h-6 w-6 text-blue-600" />
                  {documents.find((d) => d.id === activeDocument)?.title}
                </CardTitle>
                <CardDescription className="mt-2">
                  {documents.find((d) => d.id === activeDocument)?.description}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline">{documents.find((d) => d.id === activeDocument)?.category}</Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                  const content = documentContent[activeDocument] || ""
                  if (content) {
                    await navigator.clipboard.writeText(content)
                  }
                  }}
                  title="Copy document content"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Copy
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-8 w-1/2 mt-8" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ) : (
              <div className="prose prose-blue max-w-none">
                <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                  {documentContent[activeDocument] || "Document not found"}
                </ReactMarkdown>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Document Metadata */}
        <Card className="border-none shadow-md mb-12">
          <CardHeader>
            <CardTitle className="text-lg">Document Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="font-medium text-muted-foreground">Last Updated:</span>
                <div className="text-foreground">{documents.find((d) => d.id === activeDocument)?.lastUpdated}</div>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Reading Time:</span>
                <div className="text-foreground">{documents.find((d) => d.id === activeDocument)?.readTime}</div>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Category:</span>
                <div className="text-foreground">{documents.find((d) => d.id === activeDocument)?.category}</div>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Original URL:</span>
                <div>
                  <a
                  href={documents.find((d) => d.id === activeDocument)?.originalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                  >
                    View original report
                  </a>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
