import Link from "next/link";
import { GradientBackground, Wordmark } from "@leww/ui";

import { HeroParallax } from "~/components/shared/hero-parallax";

function Header() {
  return (
    <header className="fixed top-0 z-50 w-full backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center">
          <Wordmark className="h-8 w-auto" />
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Sign up
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  return (
    <>
      <GradientBackground />

      <Header />
      <div className="relative max-h-screen min-h-screen w-full overflow-hidden">
        <main className="pt-4">
          <HeroParallax products={products}>
            <div className="px-4 py-20 md:py-40">
              <div className="relative left-0 top-0 mx-auto max-w-7xl">
                <h1 className="text-2xl font-bold dark:text-white md:text-7xl">
                  Simplify Your Links
                </h1>
                <p className="mt-2 max-w-xl text-base dark:text-neutral-200 md:text-xl">
                  URL shortener, link management platform that helps you track,
                  manage your links.
                </p>
              </div>
              <div className="left-0 top-0 mx-auto max-w-7xl">
                <Link
                  href="/login"
                  className="relative z-50 mt-2 inline-block rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </HeroParallax>
        </main>
      </div>
    </>
  );
}

const products = [
  {
    title: "Moonbeam",
    thumbnail:
      "https://aceternity.com/images/products/thumbnails/new/moonbeam.png",
  },
  {
    title: "Cursor",
    thumbnail:
      "https://aceternity.com/images/products/thumbnails/new/cursor.png",
  },
  {
    title: "Rogue",
    thumbnail:
      "https://aceternity.com/images/products/thumbnails/new/rogue.png",
  },

  {
    title: "Editorially",
    thumbnail:
      "https://aceternity.com/images/products/thumbnails/new/editorially.png",
  },
  {
    title: "Editrix AI",
    thumbnail:
      "https://aceternity.com/images/products/thumbnails/new/editrix.png",
  },
  {
    title: "Pixel Perfect",
    thumbnail:
      "https://aceternity.com/images/products/thumbnails/new/pixelperfect.png",
  },

  {
    title: "Algochurn",
    thumbnail:
      "https://aceternity.com/images/products/thumbnails/new/algochurn.png",
  },
  {
    title: "Aceternity UI",
    thumbnail:
      "https://aceternity.com/images/products/thumbnails/new/aceternityui.png",
  },
  {
    title: "Tailwind Master Kit",
    thumbnail:
      "https://aceternity.com/images/products/thumbnails/new/tailwindmasterkit.png",
  },
  {
    title: "SmartBridge",
    thumbnail:
      "https://aceternity.com/images/products/thumbnails/new/smartbridge.png",
  },
  {
    title: "Renderwork Studio",
    thumbnail:
      "https://aceternity.com/images/products/thumbnails/new/renderwork.png",
  },

  {
    title: "Creme Digital",
    thumbnail:
      "https://aceternity.com/images/products/thumbnails/new/cremedigital.png",
  },
  {
    title: "Golden Bells Academy",
    thumbnail:
      "https://aceternity.com/images/products/thumbnails/new/goldenbellsacademy.png",
  },
  {
    title: "Invoker Labs",
    thumbnail:
      "https://aceternity.com/images/products/thumbnails/new/invoker.png",
  },
  {
    title: "E Free Invoice",
    thumbnail:
      "https://aceternity.com/images/products/thumbnails/new/efreeinvoice.png",
  },
];
