"use client";

import { useEffect, useState } from "react";
import Image, { type ImageProps } from "next/image";
import { LoaderCircle } from "lucide-react";

import { cn } from "~/lib";

export function BlurImage(props: ImageProps) {
  const [loading, setLoading] = useState(true);
  const [src, setSrc] = useState(props.src);
  useEffect(() => setSrc(props.src), [props.src]);

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setLoading(false);
    const target = e.target as HTMLImageElement;
    if (target.naturalWidth <= 16 && target.naturalHeight <= 16) {
      setSrc(`https://avatar.vercel.sh/${encodeURIComponent(props.alt)}`);
    }
  };

  return (
    <Image
      {...props}
      src={src}
      alt={props.alt}
      className={cn(loading ? "blur-[2px]" : "blur-0", props.className)}
      onLoad={handleLoad}
      onError={() => {
        setSrc(`https://avatar.vercel.sh/${encodeURIComponent(props.alt)}`); // if the image fails to load, use the default avatar
      }}
      unoptimized
    />
  );
}

interface BlurImageNativeProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback?: boolean;
}

export function BlurImageNative({
  src: initialSrc,
  alt = "",
  className = "",
  fallback,
  ...rest
}: BlurImageNativeProps) {
  const [loading, setLoading] = useState(true);
  const [src, setSrc] = useState(initialSrc);

  useEffect(() => {
    setSrc(initialSrc);
    setLoading(true);
  }, [initialSrc]);

  const handleLoad = () => setLoading(false);

  const handleError = () => {
    if (fallback) {
      setSrc(`https://avatar.vercel.sh/${encodeURIComponent(alt)}`);
    }
    setLoading(false);
  };

  return (
    <div className="relative h-full w-full">
      {loading && (
        <div className="absolute inset-0 z-10 flex animate-pulse items-center justify-center bg-gray-100">
          <LoaderCircle className="size-4 animate-spin" />
        </div>
      )}
      <img
        {...rest}
        src={src as string}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        className={`object-cover transition-opacity duration-300 ${
          loading ? "opacity-0" : "opacity-100"
        } ${className}`}
      />
    </div>
  );
}
