import type * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, BarChart2, Globe, Lightbulb } from "lucide-react"

const SimplifiedSection: React.FC = () => {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
      <div className="container px-4 md:px-6 mx-auto">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">
          Understand the Data
        </h2>

        <Card className="border-none shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl">Climate Data Guide</CardTitle>
            <CardDescription>
              Welcome to our climate dashboard! We know some of the charts and data points can feel technical, so here's
              a guide to help you make sense of them. The charts and images can be found by scrolling down the page.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Key Charts */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <BarChart2 className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold">Key Charts Explained</h3>
                    <ul className="list-disc list-inside space-y-2 mt-2">
                      <li>
                        <strong>Carbon Dioxide Levels:</strong> Shows how CO₂ concentrations have changed over time,
                        correlating with higher global temperatures.
                      </li>
                      <li>
                        <strong>Methane Levels:</strong> Tracks concentration trends of this powerful greenhouse gas.
                      </li>
                      <li>
                        <strong>Global Temperature Anomalies:</strong> Indicates temperature deviations from historical
                        baseline.
                      </li>
                      <li>
                        <strong>World Ocean Warming:</strong> Shows how oceans are heating up, affecting weather
                        patterns and marine life.
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <FileText className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold">AI-Generated Summaries</h3>
                    <p className="leading-relaxed mt-2">
                      We provide AI-generated summaries of recent news articles related to climate change. This feature
                      highlights major events, scientific discoveries, and public sentiment around environmental topics.
                    </p>
                  </div>
                </div>                

                <div className="flex items-start gap-3">
                  <Lightbulb className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold">Tips for Reading the Data</h3>
                    <ul className="list-disc list-inside space-y-2 mt-2">
                      <li>Look for trends over time rather than focusing on day-to-day changes.</li>
                      <li>Compare different charts to see how one might influence the other.</li>
                      <li>Check the source of each chart for detailed methodologies.</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Globe className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold">UNFCCC Conference of the Parties (COP)</h3>
                    <div className="mt-2">
                      <img
                        src="assets/cop-cycle.png"
                        alt="Cyclical Processes of COP"
                        className="mx-auto my-4 max-w-full h-auto rounded-lg shadow-sm"
                      />
                      <p className="leading-relaxed">
                        The COP implements key processes to keep global climate efforts on track. The{" "}
                        <strong>Global Stocktake (GST)</strong> occurs every 5 years to assess collective progress.
                        Countries update their <strong>Nationally Determined Contributions (NDCs)</strong> to strengthen
                        climate commitments and submit <strong>Biennial Transparency Reports (BTRs)</strong> to verify
                        their progress.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

export default SimplifiedSection

