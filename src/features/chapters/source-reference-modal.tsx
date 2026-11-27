"use client";

import { useEffect } from "react";
import { BookMarked, Scale, ScrollText, X } from "lucide-react";
import type { SourceReference } from "@/content/chapters/chapter-01";
import { playCinematicSfx } from "@/components/shared/ambient-sound-toggle";

interface SourceReferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  locationTitle: string;
  locationNumber: string;
  sources: SourceReference[];
}

export function SourceReferenceModal({
  isOpen,
  onClose,
  locationTitle,
  locationNumber,
  sources,
}: SourceReferenceModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="source-modal-title"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex max-h-[85vh] w-full max-w-2xl flex-col border border-[#e0be7b]/45 bg-[#090c0a] text-[#f7f3ea] shadow-2xl"
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 border-b border-white/10 bg-[#0d110e] px-6 py-5">
          <div>
            <div className="flex items-center gap-2">
              <BookMarked size={14} className="text-[#e0be7b]" />
              <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-[#e0be7b]">
                ARSIP DALIL & CATATAN ULAMA · LOKASI {locationNumber}
              </span>
            </div>
            <h3
              id="source-modal-title"
              className="mt-1.5 font-display text-2xl text-white"
            >
              {locationTitle}
            </h3>
          </div>

          <button
            type="button"
            onClick={() => {
              playCinematicSfx("hover");
              onClose();
            }}
            aria-label="Tutup popup sumber"
            className="cursor-pointer border border-white/15 bg-white/3 p-2 text-stone-300 transition-colors hover:border-[#e0be7b] hover:text-white"
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable Sources List */}
        <div className="space-y-5 overflow-y-auto p-6">
          {sources.map((src) => (
            <div
              key={src.id}
              className="border border-white/12 bg-[#070908]/90 p-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="border border-[#e0be7b]/40 bg-[#e0be7b]/12 px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#f5d99e]">
                  {src.badge}
                </span>
                <span className="font-mono text-xs font-medium tracking-wide text-[#e0be7b]">
                  {src.reference}
                </span>
              </div>

              <h4 className="mt-3 font-display text-lg text-white">
                {src.title}
              </h4>

              <div className="mt-3 border-l-2 border-[#e0be7b]/60 bg-white/2 py-2.5 pl-4 pr-3">
                <div className="mb-1 flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.2em] text-stone-400">
                  <ScrollText size={11} className="text-[#e0be7b]" />
                  <span>Kandungan Riwayat</span>
                </div>
                <p className="font-narrative text-sm leading-[1.8] text-stone-100 sm:text-[15px]">
                  “{src.narrationSummary}”
                </p>
              </div>

              {src.scholarlyNote && (
                <div className="mt-4 border border-amber-500/25 bg-amber-950/15 p-4">
                  <div className="flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#f5d99e]">
                    <Scale size={12} className="text-[#e0be7b]" />
                    <span>Catatan Ilmiah & Perbedaan Pendapat Ulama</span>
                  </div>
                  <p className="mt-2 whitespace-pre-line font-narrative text-xs leading-[1.8] text-stone-300 sm:text-sm">
                    {src.scholarlyNote}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-white/10 bg-[#0d110e] px-6 py-4">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-stone-400">
            {sources.length} REFERENSI TERVERIFIKASI
          </span>
          <button
            type="button"
            onClick={() => {
              playCinematicSfx("hover");
              onClose();
            }}
            className="cursor-pointer border border-[#f5d99e] bg-[#e0be7b] px-5 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#070908] transition-colors hover:bg-[#f5d99e]"
          >
            Tutup Arsip
          </button>
        </div>
      </div>
    </div>
  );
}
