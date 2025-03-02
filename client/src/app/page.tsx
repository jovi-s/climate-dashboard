"use client";

import Hero from "@/components/Hero";
import ClimateImages from "@/components/images-section";
import GraphSection from "@/components/data-graphs";
import NewsSentiment from "@/components/news-sentiment";


export default function Home() {
  return (
    <div className="flex flex-col">
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
            <a
              href="https://www.linkedin.com/in/jovindersingh/"
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              Jovi
            </a>
          </>
        }
        backgroundImage="/assets/PHOTO-Climate-Collage-Soft-NOAA-Communications-NO-NOAA-Logo-HOMEPAGE.jpg"
      />
      <GraphSection />
      <NewsSentiment />
      <ClimateImages />
    </div>
  );
}