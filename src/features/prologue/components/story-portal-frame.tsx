"use client";

import { useState, type MouseEvent } from "react";
import Image from "next/image";

interface StoryPortalFrameProps {
  currentScene: number;
  isWarping?: boolean;
}

const sceneImages = [
  "/prologue/scene-1.webp",
  "/prologue/scene-2.webp",
  "/prologue/scene-3.webp",
  "/prologue/scene-4.webp",
  "/prologue/scene-5.webp",
  "/prologue/scene-6.webp",
];

// Evolusi bentuk potongan abstrak per adegan
const sceneClipPaths = [
  // Adegan I: Fragmen retak asimetris
  "polygon(12% 3%, 88% 0%, 100% 28%, 93% 95%, 20% 100%, 0% 74%, 5% 22%)",
  // Adegan II: Potongan memanjang vertikal
  "polygon(18% 0%, 95% 7%, 87% 89%, 48% 100%, 5% 85%, 9% 17%)",
  // Adegan III (Sosok Asing): Lengkung portal runcing (Pointed Arch)
  "polygon(50% 0%, 88% 19%, 94% 100%, 6% 100%, 12% 19%)",
  // Adegan IV: Lengkungan terbuka lebar
  "polygon(24% 2%, 76% 2%, 98% 28%, 89% 98%, 11% 98%, 2% 28%)",
  // Adegan V: Portal Astrolabe simetris
  "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
  // Warp Final (scene-6): Terbuka penuh
  "polygon(15% 0%, 85% 0%, 100% 15%, 100% 85%, 85% 100%, 15% 100%, 0% 85%, 0% 15%)",
];

export function StoryPortalFrame({
  currentScene,
  isWarping = false,
}: StoryPortalFrameProps) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const activeImageIndex = isWarping
    ? sceneImages.length - 1
    : Math.min(currentScene, sceneImages.length - 1);

  const activeClip = sceneClipPaths[activeImageIndex] ?? sceneClipPaths[0];

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: nx * 10, y: ny * -10 });
  };

  const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative mx-auto flex aspect-3/4 w-full max-w-75 items-center justify-center sm:max-w-85 lg:max-w-97.5"
    >
      {/* Bingkai Ornamen Kuningan Tipis dengan Parallax Berbeda */}
      <div
        aria-hidden="true"
        style={{
          transform: `perspective(1000px) rotateY(${tilt.x * 0.55}deg) rotateX(${tilt.y * 0.55}deg)`,
        }}
        className="pointer-events-none absolute -inset-3.5 border border-accent/35 transition-transform duration-500 ease-out sm:-inset-5"
      >
        <span className="absolute -left-1 -top-1 h-3 w-3 border-l border-t border-accent" />
        <span className="absolute -right-1 -top-1 h-3 w-3 border-r border-t border-accent" />
        <span className="absolute -bottom-1 -left-1 h-3 w-3 border-b border-l border-accent" />
        <span className="absolute -bottom-1 -right-1 h-3 w-3 border-b border-r border-accent" />
      </div>

      {/* Garis Silang Axis Astrolabe Halus di Belakang */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <div className="h-[112%] w-px bg-border/60" />
        <div className="absolute h-px w-[112%] bg-border/60" />
      </div>

      {/* Wadah Potongan Abstrak + Crossfade Next/Image */}
      <div
        style={{
          clipPath: activeClip,
          transform: `perspective(1000px) rotateY(${tilt.x}deg) rotateX(${tilt.y}deg) scale(${
            isWarping ? 1.08 : 1
          })`,
        }}
        className="relative h-full w-full overflow-hidden bg-surface-elevated shadow-[0_24px_60px_-15px_rgba(0,0,0,0.45)] transition-[clip-path,transform] duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)]"
      >
        {sceneImages.map((src, idx) => {
          const isCurrent = idx === activeImageIndex;
          return (
            <Image
              key={src}
              src={src}
              alt={`Fragmen Sejarah ${idx + 1}`}
              fill
              priority={idx <= 1}
              sizes="(max-width: 640px) 300px, (max-width: 1024px) 340px, 390px"
              className={`object-cover transition-all duration-1000 ease-out ${
                isCurrent ? "scale-100 opacity-100" : "scale-110 opacity-0"
              }`}
            />
          );
        })}

        {/* Tekstur Lukisan & Vignette Tepi Potongan */}
        <div className="archival-grain pointer-events-none absolute inset-0 opacity-60" />
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/55 via-transparent to-black/20" />
      </div>

      {/* Label Indeks Artefak di Bawah Bingkai */}
      <div className="pointer-events-none absolute -bottom-8 left-0 right-0 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.25em] text-subtle">
        <span>FRAGMENT 0{activeImageIndex + 1}</span>
        <span className="text-accent">BAITUL MAQDIS ARCHIVE</span>
      </div>
    </div>
  );
}
