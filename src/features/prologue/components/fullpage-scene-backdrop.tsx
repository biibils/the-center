"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface FullpageSceneBackdropProps {
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

export function FullpageSceneBackdrop({
  currentScene,
  isWarping = false,
}: FullpageSceneBackdropProps) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const activeIndex = isWarping
    ? sceneImages.length - 1
    : Math.min(currentScene, sceneImages.length - 1);

  // Subtle parallax agar ilustrasi terasa memiliki kedalaman ruang
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      setOffset({ x: nx * -16, y: ny * -12 });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#0a0d0c]">
      {sceneImages.map((src, idx) => {
        const isCurrent = idx === activeIndex;
        return (
          <div
            key={src}
            style={{
              transform: `translate3d(${offset.x}px, ${offset.y}px, 0) scale(${
                isWarping && isCurrent ? 1.18 : isCurrent ? 1.06 : 1.02
              })`,
            }}
            className={`absolute -inset-4 transition-[opacity,transform] duration-1600 ease-out ${
              isCurrent ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={src}
              alt={`Latar Adegan ${idx + 1}`}
              fill
              priority={idx <= 1}
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>
        );
      })}

      {/* Pencahayaan Sinematik Halus: Gambar tetap jelas, tepi layar sedikit menggelap */}
      <div className="absolute inset-0 bg-black/25" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_65%_55%_at_50%_50%,rgba(10,13,12,0.42)_0%,rgba(10,13,12,0.78)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-36 bg-linear-to-t from-[#0a0d0c]/85 to-transparent" />
      <div className="absolute inset-x-0 top-0 h-28 bg-linear-to-b from-[#0a0d0c]/70 to-transparent" />
    </div>
  );
}
