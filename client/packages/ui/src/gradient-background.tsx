"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@leww/utils";

export function GradientBackground(props: { showAnimation?: boolean }) {
  const [isGridLoaded, setIsGridLoaded] = useState(false);
  const isLoaded = isGridLoaded;

  const showAnimation = props.showAnimation;

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-0 overflow-hidden bg-white transition-opacity duration-300",
        showAnimation ? (isLoaded ? "opacity-100" : "opacity-0") : "opacity-60",
      )}
    >
      <_BackgroundGradient className="opacity-15" />
      <div className="absolute left-1/2 top-0 h-full w-full -translate-x-1/2 opacity-50 transition-all sm:opacity-100">
        <Image
          src="/background-grid.svg"
          onLoad={() => setIsGridLoaded(true)}
          alt=""
          fill
        />
      </div>
      <_BackgroundGradient className="opacity-100 mix-blend-soft-light" />
    </div>
  );
}

function _BackgroundGradient({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "absolute left-0 top-0 aspect-square w-full overflow-hidden sm:aspect-[2/1]",
        "[mask-image:radial-gradient(70%_100%_at_50%_0%,_black_70%,_transparent)]",
        className,
      )}
    >
      <div
        className="absolute inset-0 saturate-150"
        style={{
          backgroundImage: `conic-gradient(from -45deg at 50% -10%, #3A8BFD 0deg, #FF0000 172.98deg, #855AFC 215.14deg, #FF7B00 257.32deg, #3A8BFD 360deg)`,
        }}
      />
      <div className="absolute inset-0 backdrop-blur-[100px]" />
    </div>
  );
}
