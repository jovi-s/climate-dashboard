"use client"

import Hero from "@/components/Hero"
import SimplifiedSection from "@/components/simplified-section"
import GraphSection from "@/components/data-graphs"
import NewsSentiment from "@/components/news-sentiment"
import ClimateImages from "@/components/images-section"
import CTA from "@/components/CTA"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <Hero
        capsuleText="This app is in active development."
        capsuleLink="https://unfccc.int/"
        subtitle="Explore the data, read the reports, and be part of the solution."
        primaryCtaText="NDC Analysis"
        primaryCtaLink="/ndc"
        secondaryCtaText="BTR Chatbot"
        secondaryCtaLink="/btr"
        credits={
          <>
            Crafted with ❤️ by{" "}
            <a href="https://www.linkedin.com/in/jovindersingh/" target="_blank" rel="noreferrer" className="underline">
              Jovi
            </a>
          </>
        }
        backgroundImage="/assets/PHOTO-Climate-Collage-Soft-NOAA-Communications-NO-NOAA-Logo-HOMEPAGE.jpg"
      />
      <SimplifiedSection />
      <GraphSection />
      <NewsSentiment />
      <ClimateImages />
      <CTA />
    </main>
  )
}
