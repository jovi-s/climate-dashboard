"use client"

import { useState, useEffect, useCallback } from "react"
import ReactMarkdown from "react-markdown"
import rehypeRaw from "rehype-raw"
import remarkGfm from "remark-gfm"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Satellite, Scale, Cloud, TrendingUp, AlertTriangle, RefreshCw } from "lucide-react"

const PROJECTION_CACHE_KEY = "climateFutureProjection"
const PROJECTION_CACHE_TTL_MS = 4 * 60 * 60 * 1000 // 4 hours

function getCachedProjection(): string | null {
  if (typeof window === "undefined") return null
  try {
    const raw = sessionStorage.getItem(PROJECTION_CACHE_KEY)
    if (!raw) return null
    const { projection, ts } = JSON.parse(raw) as { projection: string; ts: number }
    if (Date.now() - ts > PROJECTION_CACHE_TTL_MS) return null
    return projection
  } catch {
    return null
  }
}

function setCachedProjection(projection: string): void {
  if (typeof window === "undefined") return
  try {
    sessionStorage.setItem(
      PROJECTION_CACHE_KEY,
      JSON.stringify({ projection, ts: Date.now() })
    )
  } catch {
    // ignore
  }
}

const reportProducers = [
  {
    id: "copernicus",
    title: "Copernicus Climate Change Service",
    subtitle: "Global Climate Highlights",
    description: "Longitudinal analysis of C3S annual reports (2022–2025): temperature thresholds, ocean heat, Antarctic sea ice, and urgency evolution.",
    icon: Satellite,
    badge: "2022–2025",
  },
  {
    id: "ipcc",
    title: "IPCC Assessment Reports",
    subtitle: "AR4, AR5 & AR6 Synthesis",
    description: "Evolution of climate science and policy urgency across the Fourth (2007), Fifth (2014), and Sixth (2023) Assessment Reports.",
    icon: Scale,
    badge: "AR4–AR6",
  },
  {
    id: "wmo",
    title: "WMO State of the Global Climate",
    subtitle: "Annual Reports",
    description: "Longitudinal analysis of WMO State of the Global Climate reports from 2020 through 2025: severity, thresholds, and impacts.",
    icon: Cloud,
    badge: "2020–2025",
  },
] as const

type ProducerId = (typeof reportProducers)[number]["id"]

const apiBase = process.env.NEXT_PUBLIC_PYTHON_BACKEND ?? ""

export default function TrendsPage() {
  const [activeProducer, setActiveProducer] = useState<ProducerId>("wmo")
  const [summaries, setSummaries] = useState<Record<ProducerId, string>>({
    copernicus: "",
    ipcc: "",
    wmo: "",
  })
  const [loading, setLoading] = useState(true)
  const [projection, setProjection] = useState<string | null>(null)
  const [projectionLoading, setProjectionLoading] = useState(false)
  const [projectionError, setProjectionError] = useState<string | null>(null)

  const fetchProjection = useCallback(async () => {
    if (!apiBase) return

    setProjectionLoading(true)
    setProjectionError(null)
    try {
      // Try the fast pre-computed GET endpoint first
      const preRes = await fetch(`${apiBase}/api/climate-future-projection`)
      if (preRes.ok) {
        const preData = await preRes.json()
        const text = (preData.projection ?? "").trim()
        if (text) {
          setProjection(text)
          setCachedProjection(text)
          return
        }
      }

      // Fall back to on-demand POST if no pre-computed projection exists
      const copernicus = summaries.copernicus?.trim() ?? ""
      const ipcc = summaries.ipcc?.trim() ?? ""
      const wmo = summaries.wmo?.trim() ?? ""
      if (!copernicus || !ipcc || !wmo) return

      const newsRes = await fetch(`${apiBase}/api/news-sentiment`)
      if (!newsRes.ok) throw new Error("Failed to fetch news sentiment")
      const newsData = await newsRes.json()
      const report = (newsData.report ?? "").trim()

      const projRes = await fetch(`${apiBase}/api/climate-future-projection`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          newsReport: report,
          summaries: { copernicus, ipcc, wmo },
        }),
      })
      if (!projRes.ok) {
        const err = await projRes.json().catch(() => ({}))
        throw new Error((err as { detail?: string }).detail ?? "Failed to generate projection")
      }
      const projData = await projRes.json()
      const text = (projData.projection ?? "").trim()
      setProjection(text || null)
      if (text) setCachedProjection(text)
    } catch (e) {
      setProjectionError(e instanceof Error ? e.message : "Something went wrong")
      setProjection(null)
    } finally {
      setProjectionLoading(false)
    }
  }, [summaries.copernicus, summaries.ipcc, summaries.wmo])

  useEffect(() => {
    if (!apiBase) return
    let mounted = true
    fetch(`${apiBase}/api/report-summaries`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch report summaries")
        return res.json() as Promise<Record<ProducerId, string>>
      })
      .then((data) => {
        if (!mounted) return
        setSummaries({
          copernicus: data.copernicus ?? "",
          ipcc: data.ipcc ?? "",
          wmo: data.wmo ?? "",
        })
        setLoading(false)
      })
      .catch(() => {
        if (!mounted) return
        setLoading(false)
      })
    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    if (!apiBase) return
    if (loading) return

    const cached = getCachedProjection()
    if (cached) {
      setProjection(cached)
      return
    }

    fetchProjection()
  }, [loading, apiBase, fetchProjection])

  const currentProducer = reportProducers.find((p) => p.id === activeProducer)
  const currentSummary = summaries[activeProducer]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-emerald-700 via-teal-700 to-cyan-800 text-white">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm backdrop-blur-sm">
              Longitudinal summaries
            </div>
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
              Climate Report Trends
            </h1>
            <p className="mx-auto max-w-[700px] text-white/80 md:text-xl">
              Trends and evolution from major yearly climate report producers: Copernicus, IPCC, and WMO
            </p>
          </div>
        </div>
      </section>

      <div className="container px-4 md:px-6 mx-auto -mt-16">
        {/* Future projection */}
        <Card className="border-none shadow-xl mb-8">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              <CardTitle className="text-2xl">Future projection</CardTitle>
            </div>
            <CardDescription>
              Short, evidence-based outlook from recent climate news and longitudinal report summaries (Copernicus, IPCC, WMO).
            </CardDescription>
          </CardHeader>
          <CardContent>
            {projectionLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ) : projectionError ? (
              <div className="flex flex-col items-center justify-center gap-3 py-6 text-muted-foreground">
                <AlertTriangle className="h-10 w-10 text-amber-500" />
                <p className="text-sm">{projectionError}</p>
                <Button variant="outline" size="sm" onClick={fetchProjection} className="gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Retry
                </Button>
              </div>
            ) : projection ? (
              <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:scroll-mt-24 prose-p:leading-relaxed">
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                  {projection}
                </ReactMarkdown>
              </div>
            ) : null}
          </CardContent>
        </Card>

        {/* Producer selector cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {reportProducers.map((producer) => {
            const IconComponent = producer.icon
            const isActive = activeProducer === producer.id
            return (
              <Card
                key={producer.id}
                className={`cursor-pointer transition-all hover:shadow-lg border-2 ${
                  isActive
                    ? "ring-2 ring-emerald-500 border-emerald-500/50 bg-emerald-50/80 dark:bg-emerald-950/30"
                    : "border-transparent shadow-md hover:border-muted"
                }`}
                onClick={() => setActiveProducer(producer.id)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <IconComponent className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                    <Badge variant="secondary">{producer.badge}</Badge>
                  </div>
                  <CardTitle className="text-lg">{producer.title}</CardTitle>
                  <CardDescription className="text-sm font-medium text-muted-foreground">
                    {producer.subtitle}
                  </CardDescription>
                  <p className="text-sm text-muted-foreground">{producer.description}</p>
                </CardHeader>
              </Card>
            )
          })}
        </div>

        {/* Summary content */}
        <Card className="border-none shadow-xl mb-12">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              {currentProducer && (() => {
                const Icon = currentProducer.icon
                return (
                  <>
                    <Icon className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                    <CardTitle className="text-2xl">{currentProducer.title}</CardTitle>
                  </>
                )
              })()}
            </div>
            {currentProducer && (
              <CardDescription>
                {currentProducer.subtitle} — {currentProducer.description}
              </CardDescription>
            )}
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
              <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:scroll-mt-24">
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                  {currentSummary || "No summary loaded."}
                </ReactMarkdown>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
