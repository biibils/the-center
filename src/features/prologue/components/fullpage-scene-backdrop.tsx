"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export const PROLOGUE_BACKDROP_IMAGES = [
  "/prologue/scene-1.webp",
  "/prologue/scene-2.webp",
  "/prologue/scene-3.webp",
  "/prologue/scene-4.webp",
  "/prologue/scene-5.webp",
  "/prologue/scene-6.webp",
];

export const PROLOGUE_BACKDROP_VIDEOS = ["/videos/prologue/scene-5-to-6.mp4"];

interface FullpageSceneBackdropProps {
  currentScene: number;
  isWarping?: boolean;
}

export function FullpageSceneBackdrop({
  currentScene,
  isWarping = false,
}: FullpageSceneBackdropProps) {
  const prevSceneRef = useRef<number>(currentScene);
  const transitionVideoRef = useRef<HTMLVideoElement | null>(null);
  const [showTransitionVideo, setShowTransitionVideo] = useState(false);

  useEffect(() => {
    const prev = prevSceneRef.current;
    prevSceneRef.current = currentScene;

    // Putar video transisi hanya saat maju berurutan dari Scene 5 (index 4) ke Scene 6 (index 5)
    if (prev === 4 && currentScene === 5) {
      const vid = transitionVideoRef.current;
      if (vid) {
        vid.currentTime = 0;
        vid.play().catch(() => {
          setShowTransitionVideo(false);
        });
      }
    } else if (currentScene !== 5) {
      transitionVideoRef.current?.pause();
    }
  }, [currentScene]);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-black">
      {PROLOGUE_BACKDROP_IMAGES.map((src, idx) => {
        const isActive = idx === currentScene;

        return (
          <div
            key={src}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={src}
              alt=""
              fill
              priority={idx <= 1}
              sizes="100vw"
              className={`object-cover transition-transform ease-out ${
                isWarping
                  ? "scale-125 duration-1000"
                  : isActive
                    ? "scale-108 duration-16000"
                    : "scale-100 duration-1000"
              }`}
            />
          </div>
        );
      })}

      {/* Video Transisi Scene 5 -> Scene 6 (Cukup 1 instance di luar loop) */}
      <video
        ref={transitionVideoRef}
        muted
        playsInline
        preload="auto"
        poster="/prologue/scene-5.webp"
        onPlay={() => setShowTransitionVideo(true)}
        onPause={() => setShowTransitionVideo(false)}
        onEnded={() => setShowTransitionVideo(false)}
        className={`pointer-events-none absolute inset-0 z-10 h-full w-full object-cover transition-opacity duration-700 ease-out ${
          showTransitionVideo && currentScene === 5
            ? "opacity-100"
            : "opacity-0"
        }`}
      >
        <source src="/videos/prologue/scene-5-to-6.mp4" type="video/mp4" />
      </video>

      {/* Gradasi tipis di tepi bawah untuk keterbacaan timeline bar */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 z-20 h-24 bg-linear-to-t from-black/55 to-transparent"
      />
    </div>
  );
}
