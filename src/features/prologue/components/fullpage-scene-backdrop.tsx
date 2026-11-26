"use client";

import Image from "next/image";

const SCENE_IMAGES = [
  "/prologue/scene-1.webp",
  "/prologue/scene-2.webp",
  "/prologue/scene-3.webp",
  "/prologue/scene-4.webp",
  "/prologue/scene-5.webp",
  "/prologue/scene-6.webp",
];

interface FullpageSceneBackdropProps {
  currentScene: number;
  isWarping?: boolean;
}

export function FullpageSceneBackdrop({
  currentScene,
  isWarping = false,
}: FullpageSceneBackdropProps) {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-black">
      {SCENE_IMAGES.map((src, idx) => {
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

      {/* Hanya gradasi tipis di tepi paling bawah untuk keterbacaan timeline bar */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-black/55 to-transparent"
      />
    </div>
  );
}
