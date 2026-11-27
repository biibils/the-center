"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { TheCenterLogo } from "@/components/shared/the-center-logo";
import { playCinematicSfx } from "@/components/shared/ambient-sound-toggle";

interface CinematicPreloaderProps {
  images?: string[];
  videos?: string[];
  audios?: string[];
  subtitle?: string;
  /** Jika true, setelah 100% muncul tombol masuk (sekaligus membuka kunci audio browser) */
  requireInteraction?: boolean;
  enterLabel?: string;
  /** Durasi minimal agar animasi loading tidak berkedip terlalu cepat saat aset sudah ter-cache */
  minDurationMs?: number;
  /** Batas maksimal waktu tunggu (ms) jika koneksi lambat agar user tidak terjebak */
  maxTimeoutMs?: number;
  onComplete?: () => void;
}

export function CinematicPreloader({
  images = [],
  videos = [],
  audios = [],
  subtitle = "MEMUAT ARSIP & LINGKUNGAN...",
  requireInteraction = false,
  enterLabel = "Masuk ke Pengalaman",
  minDurationMs = 900,
  maxTimeoutMs = 8000,
  onComplete,
}: CinematicPreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [statusText, setStatusText] = useState("MENYIAPKAN KOORDINAT...");
  const hasStartedRef = useRef(false);

  useEffect(() => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;

    const totalAssets = images.length + videos.length + audios.length;
    const startTime = performance.now();

    if (totalAssets === 0) {
      let dismissTimer: ReturnType<typeof setTimeout> | undefined;
      const readyTimer = setTimeout(() => {
        setProgress(100);
        setIsLoaded(true);
        if (!requireInteraction) {
          dismissTimer = setTimeout(() => {
            setIsDismissed(true);
            onComplete?.();
          }, minDurationMs);
        }
      }, 0);
      return () => {
        clearTimeout(readyTimer);
        if (dismissTimer) clearTimeout(dismissTimer);
      };
    }

    let completedCount = 0;
    let finishedAll = false;
    const controller = new AbortController();

    const finishLoading = () => {
      if (finishedAll) return;
      finishedAll = true;
      setProgress(100);
      setStatusText("SEMUA ARSIP SIAP");

      const elapsed = performance.now() - startTime;
      const remainingMin = Math.max(0, minDurationMs - elapsed);

      setTimeout(() => {
        setIsLoaded(true);
        if (!requireInteraction) {
          setTimeout(() => {
            setIsDismissed(true);
            onComplete?.();
          }, 450);
        }
      }, remainingMin);
    };

    const markOneDone = (label: string) => {
      if (finishedAll) return;
      completedCount += 1;
      setStatusText(label);
      const pct = Math.min(
        99,
        Math.round((completedCount / totalAssets) * 100),
      );
      setProgress(pct);

      if (completedCount >= totalAssets) {
        finishLoading();
      }
    };

    // 1. Preload Images
    images.forEach((src) => {
      const img = new Image();
      img.onload = () => markOneDone("MEMUAT VISUAL LINGKUNGAN...");
      img.onerror = () => markOneDone("MEMUAT VISUAL LINGKUNGAN...");
      img.src = src;
    });

    // 2. Preload Videos ke HTTP Browser Cache
    videos.forEach((src) => {
      fetch(src, { signal: controller.signal })
        .then((res) => res.blob())
        .then(() => markOneDone("MENYINKRONKAN ADEGAN SINEMATIK..."))
        .catch(() => markOneDone("MENYINKRONKAN ADEGAN SINEMATIK..."));
    });

    // 3. Preload Audio BGM ke HTTP Browser Cache
    audios.forEach((src) => {
      fetch(src, { signal: controller.signal })
        .then((res) => res.blob())
        .then(() => markOneDone("MENYELARASKAN FREKUENSI AUDIO..."))
        .catch(() => markOneDone("MENYELARASKAN FREKUENSI AUDIO..."));
    });

    // Failsafe timeout agar tidak pernah stuck di jaringan lambat
    const failsafeTimer = setTimeout(() => {
      controller.abort();
      finishLoading();
    }, maxTimeoutMs);

    return () => {
      clearTimeout(failsafeTimer);
      controller.abort();
    };
  }, [
    audios,
    images,
    maxTimeoutMs,
    minDurationMs,
    onComplete,
    requireInteraction,
    videos,
  ]);

  const handleEnter = () => {
    playCinematicSfx("portal", 1.8);
    // Pemicu global agar AmbientSoundToggle langsung menyalakan musik latar
    window.dispatchEvent(new Event("center:unlock-audio"));
    setIsDismissed(true);
    onComplete?.();
  };

  if (isDismissed) return null;

  return (
    <div
      aria-live="polite"
      className={`fixed inset-0 z-100 flex flex-col items-center justify-between bg-[#060807] px-6 py-10 text-[#f7f3ea] transition-opacity duration-700 ${
        isLoaded && !requireInteraction
          ? "pointer-events-none opacity-0"
          : "opacity-100"
      }`}
    >
      {/* Ambient Radial Aura & Grid */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(224,190,123,0.12),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[64px_64px]" />

      {/* Corner HUD Frame */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-5 border border-white/10 md:inset-8"
      >
        <span className="absolute -left-px -top-px h-3 w-3 border-l-2 border-t-2 border-[#e0be7b]" />
        <span className="absolute -right-px -top-px h-3 w-3 border-r-2 border-t-2 border-[#e0be7b]" />
        <span className="absolute -bottom-px -left-px h-3 w-3 border-b-2 border-l-2 border-[#e0be7b]" />
        <span className="absolute -bottom-px -right-px h-3 w-3 border-b-2 border-r-2 border-[#e0be7b]" />
      </div>

      {/* Top Tag */}
      <div className="relative z-10 font-mono text-[10px] uppercase tracking-[0.3em] text-[#e0be7b]/80">
        THE CENTER · ARCHIVAL SYSTEM
      </div>

      {/* Center Emblem & Progress */}
      <div className="relative z-10 flex w-full max-w-md flex-col items-center text-center">
        <div className="mb-6 animate-pulse">
          <TheCenterLogo href="" size="lg" showText={false} />
        </div>

        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.28em] text-[#f5d99e]">
          {subtitle}
        </p>

        {/* Tactical Progress Bar */}
        <div className="mt-6 w-full">
          <div className="relative h-0.5 w-full bg-white/15">
            <div
              style={{ width: `${progress}%` }}
              className="h-full bg-[#e0be7b] transition-all duration-300 ease-out"
            />
            <span
              style={{ left: `${progress}%` }}
              className="absolute top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rotate-45 border border-white bg-[#f5d99e] shadow-[0_0_10px_rgba(224,190,123,0.9)] transition-all duration-300"
            />
          </div>

          <div className="mt-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em]">
            <span className="text-stone-400">{statusText}</span>
            <span className="font-semibold text-[#f5d99e]">{progress}%</span>
          </div>
        </div>

        {/* Tombol Masuk (Jika requireInteraction = true dan loading 100%) */}
        {requireInteraction && (
          <div className="mt-8 h-12">
            {isLoaded ? (
              <button
                type="button"
                onClick={handleEnter}
                onMouseEnter={() => playCinematicSfx("hover")}
                className="inline-flex cursor-pointer items-center gap-2.5 border border-[#f5d99e] bg-[#e0be7b] px-6 py-3 font-mono text-xs font-bold uppercase tracking-[0.22em] text-[#070908] shadow-[0_0_30px_rgba(224,190,123,0.3)] transition-all hover:bg-[#f5d99e]"
              >
                <span>{enterLabel}</span>
                <ArrowRight size={15} />
              </button>
            ) : (
              <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-stone-500">
                Menunggu sinkronisasi...
              </span>
            )}
          </div>
        )}
      </div>

      {/* Bottom Hint */}
      <div className="relative z-10 font-mono text-[10px] uppercase tracking-[0.22em] text-stone-500">
        Gunakan headphone untuk pengalaman audio terbaik
      </div>
    </div>
  );
}
