"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"
import ReactMarkdown from "react-markdown"
import rehypeRaw from "rehype-raw"
import { FileText, AlertTriangle } from "lucide-react"

export default function NewsSentiment() {
  const [newsData, setNewsData] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const isBrowser = typeof window !== "undefined"
    if (isBrowser) {
      const cachedData = localStorage.getItem("newsData")
      if (cachedData) {
        setNewsData(JSON.parse(cachedData))
        setLoading(false)
        return
      }
    }

    const fetchNewsSentiment = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_PYTHON_BACKEND}/api/news-sentiment`)
        if (!response.ok) {
          throw new Error("Failed to fetch news sentiment data")
        }
        const data = await response.json()
        setNewsData(data.report)
        if (isBrowser) {
          localStorage.setItem("newsData", JSON.stringify(data.report))
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError("An unknown error occurred")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchNewsSentiment()
  }, [])

  return (
    <section id="news" className="w-full py-12 md:py-24 lg:py-32 bg-white">
      <div className="container px-4 md:px-6 mx-auto">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">News Analysis</h2>

        <Card className="border-none shadow-lg">
          <CardHeader className="flex flex-row items-center gap-4">
            <FileText className="h-8 w-8 text-blue-600" />
            <div>
              <CardTitle>AI-Generated News Summary & Sentiment</CardTitle>
              <CardDescription>Over the last month, related to climate change and global warming</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-48">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-48 text-red-500 gap-2">
                <AlertTriangle className="h-6 w-6" />
                <p>Error: {error}</p>
              </div>
            ) : (
              <div className="prose prose-blue max-w-none">
                <ReactMarkdown rehypePlugins={[rehypeRaw]}>{newsData || ""}</ReactMarkdown>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

