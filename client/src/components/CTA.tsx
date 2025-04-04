import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function CTA() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-blue-600 text-white">
      <div className="container px-4 md:px-6 text-center">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-6">
          Ready to Take Climate Action?
        </h2>
        <p className="mx-auto max-w-[700px] text-lg mb-8 text-white/90">
          Explore our tools for analyzing climate data, understanding policy reports, and contributing to global
          solutions.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" variant="secondary" asChild>
            <Link href="/ndc">Explore NDC Analysis</Link>
          </Button>
          <Button
            size="lg"
            className="bg-green-500 text-black border-green-600 hover:bg-teal-400"
            variant="outline"
            asChild
          >
            <Link href="/btr">Try BTR Chatbot</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

