"use client";

import { useEffect, useRef, useState } from "react";

type SfxType = "transition" | "hover" | "portal";

export function playCinematicSfx(type: SfxType) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent("center:play-sfx", { detail: { type } }),
  );
}

interface AmbientSoundToggleProps {
  audioSrc?: string;
}

const MUTE_STORAGE_KEY = "center:audio-muted";

export function AmbientSoundToggle({
  audioSrc = "/audio/main-theme-the-discovery.mp3",
}: AmbientSoundToggleProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const sfxCtxRef = useRef<AudioContext | null>(null);
  const isPlayingRef = useRef(false);
  const fadeRafRef = useRef<number | null>(null);

  const fadeVolume = (
    targetVolume: number,
    durationMs: number,
    onDone?: () => void,
  ) => {
    const audio = audioRef.current;
    if (!audio) return;

    if (fadeRafRef.current) cancelAnimationFrame(fadeRafRef.current);

    const startVolume = audio.volume;
    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / durationMs);
      const eased = 1 - Math.pow(1 - progress, 3);
      audio.volume = Math.max(
        0,
        Math.min(1, startVolume + (targetVolume - startVolume) * eased),
      );

      if (progress < 1) {
        fadeRafRef.current = requestAnimationFrame(step);
      } else {
        onDone?.();
      }
    };

    fadeRafRef.current = requestAnimationFrame(step);
  };

  useEffect(() => {
    const audio = new Audio(audioSrc);
    audio.loop = true;
    audio.volume = 0;
    audio.preload = "auto";
    audioRef.current = audio;

    const isExplicitlyMuted = () =>
      sessionStorage.getItem(MUTE_STORAGE_KEY) === "true";

    const attemptAutoPlay = async () => {
      if (isPlayingRef.current || isExplicitlyMuted()) return false;
      try {
        await audio.play();
        setIsPlaying(true);
        isPlayingRef.current = true;
        fadeVolume(0.65, 1400);
        return true;
      } catch {
        return false;
      }
    };

    const removeInteractionListeners = () => {
      window.removeEventListener("pointerdown", onFirstInteraction);
      window.removeEventListener("keydown", onFirstInteraction);
      window.removeEventListener("touchstart", onFirstInteraction);
    };

    const onFirstInteraction = async () => {
      const started = await attemptAutoPlay();
      if (started || isExplicitlyMuted()) {
        removeInteractionListeners();
      }
    };

    // 1. Coba langsung putar saat halaman dimuat (berhasil otomatis saat pindah halaman SPA)
    attemptAutoPlay().then((started) => {
      // 2. Jika browser menahan autoplay di awal, nyalakan begitu ada klik/sentuhan pertama di mana saja
      if (!started && !isExplicitlyMuted()) {
        window.addEventListener("pointerdown", onFirstInteraction, {
          passive: true,
        });
        window.addEventListener("keydown", onFirstInteraction, {
          passive: true,
        });
        window.addEventListener("touchstart", onFirstInteraction, {
          passive: true,
        });
      }
    });

    return () => {
      removeInteractionListeners();
      if (fadeRafRef.current) cancelAnimationFrame(fadeRafRef.current);
      audio.pause();
      audio.src = "";
    };
  }, [audioSrc]);

  const triggerSfx = (type: SfxType) => {
    if (!isPlayingRef.current) return;

    if (!sfxCtxRef.current) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      sfxCtxRef.current = new AudioCtx();
    }

    const ctx = sfxCtxRef.current;
    if (ctx.state === "suspended") ctx.resume();
    const now = ctx.currentTime;

    if (type === "hover") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(780, now);
      osc.frequency.exponentialRampToValueAtTime(420, now + 0.05);
      gain.gain.setValueAtTime(0.012, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.06);
      return;
    }

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(type === "portal" ? 587.33 : 440, now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.04, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 1.9);
  };

  const toggleSound = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!isPlaying) {
      try {
        sessionStorage.setItem(MUTE_STORAGE_KEY, "false");
        await audio.play();
        setIsPlaying(true);
        isPlayingRef.current = true;
        fadeVolume(0.65, 1100);
      } catch (err) {
        console.error("Gagal memutar audio. Cek path file:", audioSrc, err);
      }
    } else {
      sessionStorage.setItem(MUTE_STORAGE_KEY, "true");
      setIsPlaying(false);
      isPlayingRef.current = false;
      fadeVolume(0, 600, () => {
        audio.pause();
      });
    }
  };

  useEffect(() => {
    const onSfx = (e: Event) => {
      const custom = e as CustomEvent<{ type: SfxType }>;
      triggerSfx(custom.detail.type);
    };
    const onChapterChange = () => triggerSfx("transition");

    window.addEventListener("center:play-sfx", onSfx);
    window.addEventListener("center:chapter-change", onChapterChange);
    return () => {
      window.removeEventListener("center:play-sfx", onSfx);
      window.removeEventListener("center:chapter-change", onChapterChange);
    };
  }, []);

  return (
    <button
      type="button"
      onClick={toggleSound}
      aria-label={isPlaying ? "Matikan musik latar" : "Nyalakan musik latar"}
      className="group relative inline-flex cursor-pointer items-center gap-2.5 border border-border/80 bg-surface/50 px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-muted backdrop-blur-md transition-all hover:border-accent hover:text-foreground"
    >
      <span className="flex h-3 items-end gap-[2.5px]" aria-hidden="true">
        <span
          className={`w-[1.5px] bg-accent transition-all duration-300 ${
            isPlaying ? "h-3 animate-pulse" : "h-1.5 opacity-50"
          }`}
        />
        <span
          className={`w-[1.5px] bg-accent transition-all duration-500 ${
            isPlaying ? "h-2 animate-bounce" : "h-1 opacity-50"
          }`}
        />
        <span
          className={`w-[1.5px] bg-accent transition-all duration-300 ${
            isPlaying ? "h-3 animate-pulse" : "h-1.5 opacity-50"
          }`}
        />
        <span
          className={`w-[1.5px] bg-accent transition-all duration-700 ${
            isPlaying ? "h-1.5 animate-bounce" : "h-1 opacity-50"
          }`}
        />
      </span>

      <span className="hidden sm:inline">
        {isPlaying ? "Audio On" : "Audio Off"}
      </span>
    </button>
  );
}
