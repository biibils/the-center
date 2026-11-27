"use client";

import { useEffect, useRef, useState } from "react";

interface SeamlessLoopVideoProps {
  src: string;
  poster?: string;
  className?: string;
  crossfadeSec?: number;
}

export function SeamlessLoopVideo({
  src,
  poster,
  className = "",
  crossfadeSec = 1.2,
}: SeamlessLoopVideoProps) {
  const [activeSlot, setActiveSlot] = useState<0 | 1>(0);
  const videoARef = useRef<HTMLVideoElement | null>(null);
  const videoBRef = useRef<HTMLVideoElement | null>(null);
  const isCrossfadingRef = useRef(false);

  useEffect(() => {
    const vA = videoARef.current;
    const vB = videoBRef.current;
    if (!vA || !vB) return;

    vA.play().catch(() => {});

    let rafId: number;

    const monitorLoop = () => {
      const current = activeSlot === 0 ? vA : vB;
      const next = activeSlot === 0 ? vB : vA;

      if (
        current.duration &&
        !current.paused &&
        !isCrossfadingRef.current &&
        current.duration - current.currentTime <= crossfadeSec
      ) {
        isCrossfadingRef.current = true;
        next.currentTime = 0;
        next
          .play()
          .then(() => {
            setActiveSlot(activeSlot === 0 ? 1 : 0);
            setTimeout(() => {
              current.pause();
              current.currentTime = 0;
              isCrossfadingRef.current = false;
            }, crossfadeSec * 1000);
          })
          .catch(() => {
            isCrossfadingRef.current = false;
          });
      }

      rafId = requestAnimationFrame(monitorLoop);
    };

    rafId = requestAnimationFrame(monitorLoop);
    return () => cancelAnimationFrame(rafId);
  }, [activeSlot, crossfadeSec]);

  return (
    <div className="relative isolate z-0 h-full w-full">
      <video
        ref={videoARef}
        src={src}
        poster={poster}
        muted
        playsInline
        preload="auto"
        style={{ transitionDuration: `${crossfadeSec * 1000}ms` }}
        className={`absolute inset-0 h-full w-full transition-opacity ease-linear ${className} ${
          activeSlot === 0 ? "z-10 opacity-100" : "z-0 opacity-0"
        }`}
      />
      <video
        ref={videoBRef}
        src={src}
        muted
        playsInline
        preload="auto"
        style={{ transitionDuration: `${crossfadeSec * 1000}ms` }}
        className={`absolute inset-0 h-full w-full transition-opacity ease-linear ${className} ${
          activeSlot === 1 ? "z-10 opacity-100" : "z-0 opacity-0"
        }`}
      />
    </div>
  );
}
