"use client";

import { useState } from "react";
import { CheckCircle2, Compass, Crosshair, Navigation } from "lucide-react";
import type { ChapterLocation } from "@/content/chapters/chapter-01";
import { playCinematicSfx } from "@/components/shared/ambient-sound-toggle";
import { HijazLevantBlueprint } from "@/features/chapters/hijaz-levant-blueprint";

type WorldMapProps = {
  locations: ChapterLocation[];
  activeLocationId: string | null;
  visitedLocationIds?: string[];
  onSelectLocation: (locationId: string) => void;
};

const NODE_POSITIONS: Record<string, { x: number; y: number }> = {
  "valley-of-bakkah": { x: 560, y: 445 }, // Makkah
  "the-distant-sanctuary": { x: 295, y: 165 }, // Al-Quds
  "the-forty-year-mystery": { x: 445, y: 325 }, // Poros Hijaz Utara
  "the-first-foundations": { x: 365, y: 245 }, // Simpul Pertemuan Syam — Hijaz
};

const FALLBACK_COORDS = [
  { x: 560, y: 445 },
  { x: 295, y: 165 },
  { x: 445, y: 325 },
  { x: 365, y: 245 },
];

export function WorldMap({
  locations,
  activeLocationId,
  visitedLocationIds = [],
  onSelectLocation,
}: WorldMapProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const resolvedMarkers = locations.map((loc, idx) => {
    const pos =
      NODE_POSITIONS[loc.id] ?? FALLBACK_COORDS[idx % FALLBACK_COORDS.length];
    return { location: loc, ...pos };
  });

  const focusedMarker =
    resolvedMarkers.find(
      (m) => m.location.id === (hoveredId ?? activeLocationId),
    ) ?? resolvedMarkers[0];

  const routePoints = resolvedMarkers.map((m) => `${m.x},${m.y}`).join(" ");

  return (
    <div className="relative overflow-hidden border border-[#e0be7b]/30 bg-[#070b0d]">
      {/* Top Blueprint Header */}
      <div className="flex items-center justify-between gap-2 border-b border-white/10 bg-[#091014] px-4 py-3">
        <div className="flex items-center gap-2">
          <Compass size={14} className="text-[#e0be7b]" />
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-[#f5d99e]">
            HIJAZ — LEVANT BLUEPRINT
          </span>
        </div>

        {focusedMarker && (
          <div className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.14em] text-cyan-200/85">
            <Crosshair
              size={11}
              className={`transition-transform duration-300 ${
                hoveredId ? "rotate-90 text-[#f5d99e]" : "text-[#e0be7b]"
              }`}
            />
            <span>{focusedMarker.location.coordinates}</span>
          </div>
        )}
      </div>

      {/* SVG Blueprint Canvas */}
      <div className="relative aspect-4/3 w-full overflow-hidden bg-[#060b0e]">
        <svg
          viewBox="0 0 800 600"
          className="h-full w-full select-none"
          role="img"
          aria-label="Peta Blueprint Perjalanan Sejarah Hijaz dan Al-Quds"
        >
          <defs>
            <pattern
              id="blueprint-minor-grid"
              width="25"
              height="25"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 25 0 L 0 0 0 25"
                fill="none"
                stroke="rgba(125, 211, 252, 0.055)"
                strokeWidth="0.7"
              />
            </pattern>
            <pattern
              id="blueprint-major-grid"
              width="100"
              height="100"
              patternUnits="userSpaceOnUse"
            >
              <rect
                width="100"
                height="100"
                fill="url(#blueprint-minor-grid)"
              />
              <path
                d="M 100 0 L 0 0 0 100"
                fill="none"
                stroke="rgba(224, 190, 123, 0.13)"
                strokeWidth="0.9"
              />
            </pattern>

            <pattern
              id="sea-hatch"
              width="10"
              height="10"
              patternTransform="rotate(45 0 0)"
              patternUnits="userSpaceOnUse"
            >
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="10"
                stroke="rgba(56, 189, 248, 0.085)"
                strokeWidth="1"
              />
            </pattern>

            <radialGradient id="blueprint-glow" cx="50%" cy="50%" r="55%">
              <stop offset="0%" stopColor="rgba(14, 116, 144, 0.24)" />
              <stop offset="65%" stopColor="rgba(7, 11, 13, 0.92)" />
              <stop offset="100%" stopColor="rgba(4, 7, 9, 1)" />
            </radialGradient>

            <filter id="gold-glow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="4.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <rect width="800" height="600" fill="url(#blueprint-glow)" />
          <rect width="800" height="600" fill="url(#blueprint-major-grid)" />

          {/* Geografi Hijaz - Levant */}
          <HijazLevantBlueprint />

          {/* Garis Jalur Penghubung */}
          {resolvedMarkers.length > 1 && (
            <>
              <polyline
                points={routePoints}
                fill="none"
                stroke="rgba(224, 190, 123, 0.22)"
                strokeWidth="4"
                filter="url(#gold-glow)"
              />
              <polyline
                points={routePoints}
                fill="none"
                stroke="#f5d99e"
                strokeWidth="1.4"
                strokeDasharray="6 6"
              />
            </>
          )}

          {/* Garis Crosshair Bidik saat Hover */}
          {hoveredId && focusedMarker && (
            <g className="pointer-events-none" opacity="0.45">
              <line
                x1={focusedMarker.x}
                y1={0}
                x2={focusedMarker.x}
                y2={600}
                stroke="#f5d99e"
                strokeWidth="0.8"
                strokeDasharray="3 4"
              />
              <line
                x1={0}
                y1={focusedMarker.y}
                x2={800}
                y2={focusedMarker.y}
                stroke="#f5d99e"
                strokeWidth="0.8"
                strokeDasharray="3 4"
              />
            </g>
          )}

          {/* Interactive Location Nodes */}
          {resolvedMarkers.map(({ location, x, y }) => {
            const isActive = activeLocationId === location.id;
            const isHovered = hoveredId === location.id;
            const isVisited = visitedLocationIds.includes(location.id);
            const highlighted = isActive || isHovered;

            return (
              <g
                key={location.id}
                transform={`translate(${x}, ${y})`}
                onClick={() => {
                  playCinematicSfx("transition");
                  onSelectLocation(location.id);
                }}
                onMouseEnter={() => {
                  playCinematicSfx("hover");
                  setHoveredId(location.id);
                }}
                onMouseLeave={() => setHoveredId(null)}
                className="cursor-pointer focus:outline-none"
                role="button"
                tabIndex={0}
                aria-label={`Pilih lokasi ${location.title}`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelectLocation(location.id);
                  }
                }}
              >
                <circle r="32" fill="transparent" />

                {highlighted && (
                  <>
                    <circle
                      r="26"
                      fill="rgba(224, 190, 123, 0.14)"
                      stroke="rgba(245, 217, 158, 0.65)"
                      strokeWidth="1"
                      className="origin-center animate-ping"
                      style={{ animationDuration: "2.4s" }}
                    />
                    <circle
                      r="20"
                      fill="rgba(224, 190, 123, 0.1)"
                      stroke="#f5d99e"
                      strokeWidth="1.2"
                      strokeDasharray={
                        isHovered && !isActive ? "3 3" : undefined
                      }
                    />
                  </>
                )}

                <g
                  className={`origin-center transition-transform duration-300 ${
                    isHovered
                      ? "scale-125"
                      : isActive
                        ? "scale-110"
                        : "scale-100"
                  }`}
                >
                  <polygon
                    points="0,-11 11,0 0,11 -11,0"
                    fill={
                      isActive ? "#e0be7b" : isHovered ? "#262013" : "#0b1318"
                    }
                    stroke={highlighted ? "#fffbeb" : "#e0be7b"}
                    strokeWidth={highlighted ? "2.1" : "1.6"}
                    filter={highlighted ? "url(#gold-glow)" : undefined}
                  />

                  <circle
                    r="3.2"
                    fill={
                      isActive
                        ? "#070908"
                        : isHovered
                          ? "#f5d99e"
                          : isVisited
                            ? "#34d399"
                            : "#f5d99e"
                    }
                  />
                </g>

                {/* Callout Plate */}
                <g transform="translate(18, -19)">
                  <rect
                    x="0"
                    y="0"
                    width="192"
                    height={isHovered && !isActive ? "48" : "38"}
                    fill={
                      isActive
                        ? "rgba(224, 190, 123, 0.22)"
                        : isHovered
                          ? "rgba(18, 24, 28, 0.96)"
                          : "rgba(7, 11, 14, 0.9)"
                    }
                    stroke={
                      highlighted
                        ? "rgba(245, 217, 158, 0.95)"
                        : "rgba(224, 190, 123, 0.35)"
                    }
                    strokeWidth={highlighted ? "1.3" : "1"}
                  />
                  <rect
                    x="0"
                    y="0"
                    width="3"
                    height={isHovered && !isActive ? "48" : "38"}
                    fill={highlighted ? "#f5d99e" : "rgba(224, 190, 123, 0.5)"}
                  />

                  <text
                    x="11"
                    y="14"
                    className="fill-[#e0be7b] font-mono text-[8px] tracking-[0.2em]"
                  >
                    NODE {location.number} · {location.regionLabel}
                  </text>
                  <text
                    x="11"
                    y="28"
                    className="fill-white font-sans text-[11px] font-semibold tracking-wide"
                  >
                    {location.title}
                  </text>

                  {isHovered && !isActive && (
                    <text
                      x="11"
                      y="41"
                      className="fill-[#f5d99e] font-mono text-[8px] tracking-[0.18em]"
                    >
                      KLIK UNTUK INSPEKSI →
                    </text>
                  )}
                </g>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Node Selector Bar di Bawah Peta (Rapi 2x2 Grid, Tidak Menutupi Peta) */}
      <div className="grid grid-cols-2 divide-x divide-y divide-white/10 border-t border-white/10 bg-[#080c0f]">
        {locations.map((loc) => {
          const isActive = loc.id === activeLocationId;
          const isHovered = loc.id === hoveredId;

          return (
            <button
              key={loc.id}
              type="button"
              onClick={() => {
                playCinematicSfx("transition");
                onSelectLocation(loc.id);
              }}
              onMouseEnter={() => {
                playCinematicSfx("hover");
                setHoveredId(loc.id);
              }}
              onMouseLeave={() => setHoveredId(null)}
              className={`flex cursor-pointer items-center justify-between gap-2 px-4 py-3 text-left transition-colors ${
                isActive
                  ? "bg-[#e0be7b]/15 text-[#f5d99e]"
                  : isHovered
                    ? "bg-white/4 text-white"
                    : "text-stone-400 hover:text-stone-200"
              }`}
            >
              <div className="min-w-0">
                <span className="block font-mono text-[9px] uppercase tracking-[0.2em] text-[#e0be7b]/80">
                  NODE {loc.number}
                </span>
                <span className="block truncate text-xs font-medium text-white">
                  {loc.title}
                </span>
              </div>
              <span
                className={`h-2 w-2 shrink-0 rotate-45 ${
                  isActive ? "bg-[#f5d99e]" : "border border-white/25"
                }`}
              />
            </button>
          );
        })}
      </div>

      {/* Bottom Telemetry Strip */}
      <div className="flex items-center justify-between border-t border-white/10 bg-[#091014] px-4 py-2.5">
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-stone-400">
          <Navigation size={11} className="text-[#e0be7b]" />
          <span>Klik koordinat peta</span>
        </div>

        <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-[#f5d99e]">
          <CheckCircle2 size={11} />
          <span>
            {visitedLocationIds.length}/{locations.length} SURVEYED
          </span>
        </div>
      </div>
    </div>
  );
}
