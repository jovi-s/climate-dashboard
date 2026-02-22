"use client"

import { useState, useEffect } from "react"
import ReactMarkdown from "react-markdown"
import rehypeRaw from "rehype-raw"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Satellite, Scale, Cloud } from "lucide-react"

const reportProducers = [
  {
    id: "copernicus",
    title: "Copernicus Climate Change Service",
    subtitle: "Global Climate Highlights",
    description: "Longitudinal analysis of C3S annual reports (2022–2025): temperature thresholds, ocean heat, Antarctic sea ice, and urgency evolution.",
    assetPath: "/assets/copernicus-gch/2022-2025_summary.md",
    icon: Satellite,
    badge: "2022–2025",
  },
  {
    id: "ipcc",
    title: "IPCC Assessment Reports",
    subtitle: "AR4, AR5 & AR6 Synthesis",
    description: "Evolution of climate science and policy urgency across the Fourth (2007), Fifth (2014), and Sixth (2023) Assessment Reports.",
    assetPath: "/assets/ipcc_ar/ar4-6_overall_summary.md",
    icon: Scale,
    badge: "AR4–AR6",
  },
  {
    id: "wmo",
    title: "WMO State of the Global Climate",
    subtitle: "Annual Reports",
    description: "Longitudinal analysis of WMO State of the Global Climate reports from 2020 through 2024: severity, thresholds, and impacts.",
    assetPath: "/assets/wmo_reports_pdf_summary/2020-2024_overall_summary.md",
    icon: Cloud,
    badge: "2020–2024",
  },
] as const

type ProducerId = (typeof reportProducers)[number]["id"]

async function fetchSummary(assetPath: string): Promise<string> {
  const res = await fetch(assetPath)
  if (!res.ok) return "Summary not available."
  return await res.text()
}

export default function TrendsPage() {
  const [activeProducer, setActiveProducer] = useState<ProducerId>("wmo")
  const [summaries, setSummaries] = useState<Record<ProducerId, string>>({
    copernicus: "",
    ipcc: "",
    wmo: "",
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    Promise.all(
      reportProducers.map(async (p) => {
        const text = await fetchSummary(p.assetPath)
        return [p.id, text] as const
      }),
    ).then((results) => {
      if (!mounted) return
      const next: Record<ProducerId, string> = { ...summaries }
      results.forEach(([id, text]) => {
        next[id as ProducerId] = text
      })
      setSummaries(next)
      setLoading(false)
    })
    return () => {
      mounted = false
    }
  }, [])

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
                <ReactMarkdown rehypePlugins={[rehypeRaw]}>
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
