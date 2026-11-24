"use client";

import { MapPin, Lock, CheckCircle2 } from "lucide-react";
import type { ChapterLocation } from "@/content/chapters/chapter-01";

type WorldMapProps = {
  locations: ChapterLocation[];
  activeLocationId: string | null;
  onSelectLocation: (locationId: string) => void;
};

export function WorldMap({
  locations,
  activeLocationId,
  onSelectLocation,
}: WorldMapProps) {
  return (
    <div className="relative overflow-hidden border border-border bg-surface/40">
      <div className="relative aspect-4/3 min-h-105 overflow-hidden bg-[#b7a98d]">
        {/* Map atmosphere */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(239,224,190,0.8),rgba(151,132,100,0.5))]" />

        <div className="absolute inset-0 opacity-30 bg-[linear-gradient(rgba(80,65,45,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(80,65,45,0.12)_1px,transparent_1px)] bg-size-[40px_40px]" />

        <div className="absolute left-[12%] top-[18%] h-[65%] w-[76%] rounded-[45%] border border-[#78694e]/30" />

        <div className="absolute left-[30%] top-[32%] h-[40%] w-[40%] rounded-full border border-dashed border-[#78694e]/40" />

        {/* Decorative terrain */}
        <div className="absolute left-[8%] top-[55%] h-28 w-40 rotate-12 rounded-full bg-[#a09272]/30 blur-xl" />
        <div className="absolute right-[10%] top-[20%] h-32 w-44 -rotate-12 rounded-full bg-[#8e8063]/30 blur-xl" />

        {/* Location markers */}
        {locations.map((location, index) => {
          const positions = [
            { left: "72%", top: "72%" },
            { left: "32%", top: "28%" },
            { left: "50%", top: "48%" },
            { left: "75%", top: "25%" },
          ];

          const isActive = activeLocationId === location.id;
          const isLocked = index > 0 && !activeLocationId;

          return (
            <button
              key={location.id}
              onClick={() => onSelectLocation(location.id)}
              style={positions[index]}
              className="absolute z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2"
              aria-label={`Pilih lokasi ${location.title}`}
            >
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 shadow-lg transition-all ${
                  isActive
                    ? "scale-125 border-[#f5e9cf] bg-[#51432f] text-[#f5e9cf]"
                    : "border-[#51432f] bg-[#e8d9b8] text-[#51432f] hover:scale-110"
                }`}
              >
                {isLocked ? <Lock size={15} /> : <MapPin size={17} />}
              </span>

              <span className="whitespace-nowrap rounded bg-[#51432f]/90 px-2 py-1 text-[10px] font-medium tracking-wide text-[#f5e9cf]">
                {location.number}. {location.title}
              </span>
            </button>
          );
        })}

        <div className="absolute left-5 top-5 text-[#51432f]">
          <p className="font-display text-lg tracking-wider">
            THE FIRST FOUNDATIONS
          </p>
          <p className="mt-1 text-[9px] uppercase tracking-[0.25em]">
            Historical Exploration Map
          </p>
        </div>

        <div className="absolute bottom-5 right-5 text-right text-[#51432f]">
          <p className="font-mono text-[9px] tracking-widest">CHAPTER 01</p>
          <p className="mt-1 text-[10px]">Illustrative Map</p>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-border px-5 py-4">
        <div className="flex items-center gap-2 text-xs text-muted">
          <CheckCircle2 size={14} className="text-accent" />
          Pilih lokasi untuk mulai menjelajah
        </div>

        <span className="font-mono text-xs text-subtle">
          {locations.length} LOCATIONS
        </span>
      </div>
    </div>
  );
}
