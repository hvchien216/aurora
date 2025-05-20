"use client";

import { forwardRef, useState, VideoHTMLAttributes } from "react";
import { DialogTitle } from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import MediaThemeSutro from "player.style/sutro/react";
import { Play } from "lucide-react";
import { cn } from "@leww/utils";

import { Button } from "./button";
import { Dialog, DialogContent, DialogHeader } from "./dialog";

export interface VideoPlayerProps
  extends VideoHTMLAttributes<HTMLVideoElement> {
  handleEnded?: () => void;
  handlePlay?: () => void;
  handlePause?: () => void;
  showPreviewButton?: boolean;
}

export const VideoPlayer = forwardRef<HTMLVideoElement, VideoPlayerProps>(
  (
    {
      className,
      src,
      poster,
      controls,
      autoPlay,
      muted,
      loop,
      playsInline,
      crossOrigin,
      handleEnded,
      handlePlay,
      handlePause,
      ...props
    },
    ref,
  ) => {
    return (
      <MediaThemeSutro className={className}>
        <video
          ref={ref}
          slot="media"
          src={src}
          poster={poster}
          controls={controls}
          autoPlay={autoPlay}
          muted={muted}
          loop={loop}
          playsInline={playsInline}
          crossOrigin={crossOrigin}
          className="size-full object-fill"
          tabIndex={-1}
          {...props}
        />
      </MediaThemeSutro>
    );
  },
);

export interface VideoPlayerPreviewProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The source URL for the video
   */
  src: string;
  /**
   * Optional poster image URL
   */
  poster?: string;
  /**
   * Whether to show video controls
   * @default false
   */
  controls?: boolean;
  /**
   * Whether to autoplay the video
   * @default false
   */
  autoPlay?: boolean;
  /**
   * Whether to mute the video
   * @default true
   */
  muted?: boolean;
  /**
   * Whether to loop the video
   * @default false
   */
  loop?: boolean;
  /**
   * Whether to play the video inline (mobile)
   * @default true
   */
  playsInline?: boolean;
  /**
   * Cross-origin attribute for the video element
   * @default "anonymous"
   */
  crossOrigin?: "anonymous" | "use-credentials" | "";
  /**
   * Whether to show a preview button for fullscreen modal view
   * @default false
   */
  showPreviewButton?: boolean;
}

export const VideoPlayerPreview = forwardRef<
  HTMLDivElement,
  VideoPlayerPreviewProps
>(
  (
    {
      src,
      poster,
      controls = false,
      autoPlay = false,
      muted = true,
      loop = false,
      playsInline = true,
      crossOrigin = "anonymous",
      showPreviewButton = false,
      className,
      ...props
    },
    ref,
  ) => {
    const [showFullscreen, setShowFullscreen] = useState(false);

    return (
      <>
        <div ref={ref} className={cn("relative", className)} {...props}>
          <video
            slot="media"
            src={src}
            poster={poster}
            controls={false}
            autoPlay={autoPlay}
            muted={muted}
            loop={loop}
            playsInline={false}
            crossOrigin={crossOrigin}
            className="size-full object-fill"
          />

          {showPreviewButton && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute inset-0 m-auto h-12 w-12 rounded-full bg-black/25 text-white/90 backdrop-blur-sm hover:bg-black/40 hover:text-white"
              onClick={() => setShowFullscreen(true)}
            >
              <Play className="size-5" />
            </Button>
          )}
        </div>

        {showPreviewButton && (
          <Dialog open={showFullscreen} onOpenChange={setShowFullscreen}>
            <DialogContent className="w-[calc(100vw-2rem)] border-0 p-0 shadow-xl sm:rounded-2xl">
              <VisuallyHidden asChild>
                <DialogHeader>
                  <DialogTitle></DialogTitle>
                </DialogHeader>
              </VisuallyHidden>
              <div className="overflow-hidden sm:rounded-2xl">
                <VideoPlayer
                  src={src}
                  autoPlay={true}
                  muted={false}
                  playsInline={playsInline}
                  className="size-full bg-white"
                />
              </div>
            </DialogContent>
          </Dialog>
        )}
      </>
    );
  },
);

VideoPlayerPreview.displayName = "VideoPlayerPreview";
