import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface HeroProps {
  capsuleText: string;
  capsuleLink: string;
  subtitle: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  credits?: React.ReactNode;
  backgroundImage: string; // Background image URL
}

export default function Hero({
  capsuleText,
  capsuleLink,
  subtitle,
  primaryCtaText,
  primaryCtaLink,
  secondaryCtaText,
  secondaryCtaLink,
  credits,
  backgroundImage,
}: HeroProps) {
  return (
    <section className="relative w-full" style={{ marginTop: "64px" }}>
      {/* Background Image Container */}
      <div className="relative w-full h-[70vh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${backgroundImage})`,
          }}
        >
          {/* Tint overlay */}
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
      </div>

      {/* Content */}
      <div className="absolute top-0 w-full h-[70vh] flex flex-col items-center justify-center text-center z-10 space-y-6 px-6">
        <Link
          href={capsuleLink}
          className="rounded-2xl bg-gray-800 text-white px-4 py-1.5 text-sm font-medium shadow-md hover:bg-gray-700"
          target="_blank"
        >
          {capsuleText}
        </Link>
        <h1 className="font-heading text-3xl sm:text-5xl lg:text-7xl text-white">
          A Climate in{" "}
          <span className="text-red-500">Crisis</span>
        </h1>
        <p className="max-w-[42rem] leading-normal sm:text-xl sm:leading-8 text-gray-300">
          {subtitle}
        </p>
        <div className="flex gap-4 flex-wrap justify-center">
          <Link
            href={primaryCtaLink}
            className={cn(
              buttonVariants({ size: "lg" }),
              "bg-blue-600 text-white hover:bg-blue-500"
            )}
          >
            {primaryCtaText}
          </Link>
          <Link
            href={secondaryCtaLink}
            target="_blank"
            rel="noreferrer"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "border-white text-black bg-white hover:bg-gray-200"
            )}
          >
            {secondaryCtaText}
          </Link>
        </div>
        {credits && (
          <p className="text-sm text-gray-400 mt-4">{credits}</p>
        )}
      </div>
    </section>
  );
}