"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { Compass, Volume2, VolumeX } from "lucide-react";
import { playCinematicSfx } from "@/components/shared/ambient-sound-toggle";

const ENTERED_STORAGE_KEY = "center:session-entered";
const MUTE_STORAGE_KEY = "center:audio-muted";

function subscribeToSessionEntry() {
  return () => {};
}

function getSessionEntrySnapshot() {
  return sessionStorage.getItem(ENTERED_STORAGE_KEY) !== "true";
}

function getServerSessionEntrySnapshot() {
  return true;
}

export function OpeningGate() {
  const hasNotEntered = useSyncExternalStore(
    subscribeToSessionEntry,
    getSessionEntrySnapshot,
    getServerSessionEntrySnapshot,
  );
  const [isDismissed, setIsDismissed] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const isVisible = hasNotEntered && !isDismissed;

  useEffect(() => {
    // Pastikan posisi awal selalu di paling atas (index-0)
    if (isVisible) {
      window.scrollTo(0, 0);
    }
  }, [isVisible]);

  // Kunci scroll selama tirai pembuka aktif
  useEffect(() => {
    if (isVisible) {
      window.scrollTo(0, 0);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isVisible]);

  const handleEnter = (
    e: React.MouseEvent<HTMLButtonElement>,
    withAudio: boolean,
  ) => {
    // Cegah event klik bocor ke listener CinematicExperience (penyebab loncat ke index-1)
    e.stopPropagation();
    if (isFadingOut) return;

    window.scrollTo(0, 0);
    sessionStorage.setItem(ENTERED_STORAGE_KEY, "true");
    sessionStorage.setItem(MUTE_STORAGE_KEY, withAudio ? "false" : "true");

    if (withAudio) {
      window.dispatchEvent(new CustomEvent("center:unlock-audio"));
      playCinematicSfx("portal");
    }

    setIsFadingOut(true);
    setTimeout(() => {
      window.scrollTo(0, 0);
      setIsDismissed(true);
    }, 1000);
  };

  if (!isVisible) return null;

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
      onWheel={(e) => e.stopPropagation()}
      className={`fixed inset-0 z-100 flex h-dvh w-screen flex-col items-center justify-center bg-[#070908] px-6 text-[#f7f3ea] transition-opacity duration-1000 ease-in-out select-none ${
        isFadingOut ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      {/* Bingkai Ornamen Sudut RPG Fullscreen */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-5 border border-[#c7a66a]/20 md:inset-8"
      >
        <span className="absolute -left-px -top-px h-4 w-4 border-l border-t border-[#e0be7b]" />
        <span className="absolute -right-px -top-px h-4 w-4 border-r border-t border-[#e0be7b]" />
        <span className="absolute -bottom-px -left-px h-4 w-4 border-b border-l border-[#e0be7b]" />
        <span className="absolute -bottom-px -right-px h-4 w-4 border-b border-r border-[#e0be7b]" />
      </div>

      {/* Konten Utama Terpusat (Tanpa Navbar & Tanpa Header) */}
      <div className="relative z-10 flex max-w-2xl flex-col items-center text-center">
        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full border border-[#c7a66a]/40 bg-[#c7a66a]/10 text-[#e0be7b] shadow-[0_0_24px_rgba(199,166,106,0.2)]">
          <Compass size={22} strokeWidth={1.5} />
        </div>

        <span className="font-mono text-[11px] uppercase tracking-[0.4em] text-[#d8b878]">
          THE BAITUL MAQDIS JOURNEY
        </span>

        <h1 className="mt-4 font-display text-3xl tracking-[0.14em] text-white sm:text-5xl md:text-6xl">
          PANGGILAN SEJARAH
        </h1>

        <div className="my-5 flex items-center gap-3 text-[#c7a66a]">
          <span className="h-px w-14 bg-linear-to-r from-transparent to-[#c7a66a]" />
          <span className="text-[10px]">◆</span>
          <span className="h-px w-14 bg-linear-to-l from-transparent to-[#c7a66a]" />
        </div>

        <p className="max-w-md font-narrative text-base italic leading-relaxed text-stone-300 sm:text-lg">
          “Gunakan headphone untuk pengalaman audio dan narasi terbaik.”
        </p>

        {/* Tombol Masuk Utama (Trigger Audio) */}
        <button
          type="button"
          onClick={(e) => handleEnter(e, true)}
          className="group relative mt-9 inline-flex cursor-pointer items-center gap-3 border border-[#e0be7b]/70 bg-[#c7a66a]/15 px-8 py-3.5 font-mono text-xs font-semibold uppercase tracking-[0.32em] text-[#f7e4bc] shadow-[0_0_28px_rgba(199,166,106,0.18)] transition-all duration-300 hover:border-[#f0d399] hover:bg-[#c7a66a]/25 hover:text-white hover:shadow-[0_0_36px_rgba(224,190,123,0.35)]"
        >
          <Volume2
            size={15}
            className="text-[#e0be7b] transition-transform duration-300 group-hover:scale-110"
          />
          <span>Ketuk untuk Memulai</span>
        </button>

        {/* Opsi Masuk Tanpa Suara */}
        <button
          type="button"
          onClick={(e) => handleEnter(e, false)}
          className="mt-5 inline-flex cursor-pointer items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.24em] text-stone-400 transition-colors hover:text-stone-200"
        >
          <VolumeX size={12} />
          <span>Masuk Tanpa Suara</span>
        </button>
      </div>
    </div>
  );
}
