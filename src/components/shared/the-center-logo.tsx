"use client";

import type { MouseEvent } from "react";
import Link from "next/link";
import { playCinematicSfx } from "@/components/shared/ambient-sound-toggle";

interface TheCenterLogoProps {
  href?: string;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  subtitle?: string;
  adaptiveTheme?: boolean;
  className?: string;
}

export function TheCenterLogo({
  href = "/",
  onClick,
  size = "md",
  showText = true,
  subtitle,
  adaptiveTheme = false,
  className = "",
}: TheCenterLogoProps) {
  const sizes = {
    sm: {
      icon: "h-8 w-8",
      text: "text-sm tracking-[0.24em]",
      sub: "text-[8px] tracking-[0.24em]",
      gap: "gap-2.5",
    },
    md: {
      icon: "h-9 w-9",
      text: "text-md tracking-[0.26em]",
      sub: "text-[9px] tracking-[0.26em]",
      gap: "gap-3",
    },
    lg: {
      icon: "h-14 w-14",
      text: "text-lg tracking-[0.3em]",
      sub: "text-[10px] tracking-[0.3em]",
      gap: "gap-4",
    },
  }[size];

  const tone = adaptiveTheme
    ? {
        circle: "stroke-accent/45 group-hover:stroke-accent",
        square:
          "fill-accent/10 stroke-accent/75 group-hover:fill-accent/20 group-hover:stroke-accent",
        octagon: "fill-accent group-hover:fill-accent-hover",
        title: "text-foreground group-hover:text-accent",
        sub: "text-muted",
      }
    : {
        circle: "stroke-[#e0be7b]/45 group-hover:stroke-[#f5d99e]/90",
        square:
          "fill-[#e0be7b]/8 stroke-[#e0be7b]/75 group-hover:fill-[#e0be7b]/16 group-hover:stroke-[#f5d99e]",
        octagon: "fill-[#e0be7b] group-hover:fill-[#f5d99e]",
        title: "text-white group-hover:text-[#f0d399]",
        sub: "text-[#e0be7b]/80",
      };

  const inner = (
    <span
      className={`group inline-flex items-center ${sizes.gap} ${className}`}
    >
      {/* 3 Elemen Geometris: Lingkaran (Keberkahan) -> Persegi -> Segi Delapan Filled (Kubah Batu) */}
      <svg
        viewBox="0 0 40 40"
        fill="none"
        aria-hidden="true"
        className={`shrink-0 transition-transform duration-500 group-hover:scale-105 ${sizes.icon}`}
      >
        {/* 1. Lingkaran Luar */}
        <circle
          cx="20"
          cy="20"
          r="18.5"
          className={`transition-colors duration-300 ${tone.circle}`}
          strokeWidth="1"
        />

        {/* 2. Persegi / Diamond Frame */}
        <polygon
          points="20,6.5 33.5,20 20,33.5 6.5,20"
          className={`transition-all duration-300 ${tone.square}`}
          strokeWidth="1"
        />

        {/* 3. Segi Delapan Filled */}
        <polygon
          points="18.43,16.2 21.57,16.2 23.8,18.43 23.8,21.57 21.57,23.8 18.43,23.8 16.2,21.57 16.2,18.43"
          className={`transition-colors duration-300 ${tone.octagon}`}
        />
      </svg>

      {showText && (
        <span className="flex flex-col text-left">
          <span
            className={`font-display transition-colors duration-300 ${tone.title} ${sizes.text}`}
          >
            THE CENTER
          </span>
          {subtitle && (
            <span
              className={`mt-0.5 font-mono uppercase ${tone.sub} ${sizes.sub}`}
            >
              {subtitle}
            </span>
          )}
        </span>
      )}
    </span>
  );

  if (!href) return inner;

  return (
    <Link
      href={href}
      onClick={onClick}
      onMouseEnter={() => playCinematicSfx("hover")}
      className="inline-flex items-center focus:outline-none"
    >
      {inner}
    </Link>
  );
}
