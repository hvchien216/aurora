import { useCallback, useEffect, useRef, useState } from "react";

export interface VideoPlayerOptions {
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
  playsInline?: boolean;
  crossOrigin?: "anonymous" | "use-credentials" | "";
  onEnded?: () => void;
  onPlay?: () => void;
  onPause?: () => void;
  onTimeUpdate?: (currentTime: number) => void;
  onDurationChange?: (duration: number) => void;
}

export interface UseVideoPlayerReturn {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isPlaying: boolean;
  duration: number;
  currentTime: number;
  isFullscreen: boolean;
  togglePlay: () => void;
  toggleFullscreen: (state?: boolean) => void;
  seekTo: (time: number) => void;
}

export function useVideoPlayer(
  options?: VideoPlayerOptions,
): UseVideoPlayerReturn {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Handle play/pause toggling
  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;

    if (videoRef.current.paused) {
      videoRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          options?.onPlay?.();
        })
        .catch((error) => {
          console.error("Error playing video:", error);
        });
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
      options?.onPause?.();
    }
  }, [options]);

  // Seek to specific time
  const seekTo = useCallback(
    (time: number) => {
      if (!videoRef.current) return;

      if (time >= 0 && time <= duration) {
        videoRef.current.currentTime = time;
        setCurrentTime(time);
      }
    },
    [duration],
  );

  // Toggle fullscreen view
  const toggleFullscreen = useCallback(
    (state?: boolean) => {
      setIsFullscreen(state !== undefined ? state : !isFullscreen);
    },
    [isFullscreen],
  );

  // Setup event listeners
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handleEnded = () => {
      setIsPlaying(false);
      options?.onEnded?.();
    };

    const handleTimeUpdate = () => {
      setCurrentTime(videoElement.currentTime);
      options?.onTimeUpdate?.(videoElement.currentTime);
    };

    const handleDurationChange = () => {
      setDuration(videoElement.duration);
      options?.onDurationChange?.(videoElement.duration);
    };

    const handlePlay = () => {
      setIsPlaying(true);
      options?.onPlay?.();
    };

    const handlePause = () => {
      setIsPlaying(false);
      options?.onPause?.();
    };

    // Add event listeners
    videoElement.addEventListener("ended", handleEnded);
    videoElement.addEventListener("timeupdate", handleTimeUpdate);
    videoElement.addEventListener("durationchange", handleDurationChange);
    videoElement.addEventListener("play", handlePlay);
    videoElement.addEventListener("pause", handlePause);

    // Cleanup
    return () => {
      videoElement.removeEventListener("ended", handleEnded);
      videoElement.removeEventListener("timeupdate", handleTimeUpdate);
      videoElement.removeEventListener("durationchange", handleDurationChange);
      videoElement.removeEventListener("play", handlePlay);
      videoElement.removeEventListener("pause", handlePause);
    };
  }, [options]);

  return {
    videoRef,
    isPlaying,
    duration,
    currentTime,
    isFullscreen,
    togglePlay,
    toggleFullscreen,
    seekTo,
  };
}
