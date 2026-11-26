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
  secondaryAudioSrc?: string;
  activeTrack?: 1 | 2;
  isSilenced?: boolean;
}

const MUTE_STORAGE_KEY = "center:audio-muted";

export function AmbientSoundToggle({
  audioSrc = "/audio/main-theme-the-discovery.mp3",
  secondaryAudioSrc,
  activeTrack = 1,
  isSilenced = false,
}: AmbientSoundToggleProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const track1Ref = useRef<HTMLAudioElement | null>(null);
  const track2Ref = useRef<HTMLAudioElement | null>(null);
  const sfxCtxRef = useRef<AudioContext | null>(null);
  const isPlayingRef = useRef(false);
  const activeTrackRef = useRef(activeTrack);
  const isSilencedRef = useRef(isSilenced);

  useEffect(() => {
    activeTrackRef.current = activeTrack;
    isSilencedRef.current = isSilenced;
  }, [activeTrack, isSilenced]);

  const fadeAudio = (
    audio: HTMLAudioElement | null,
    targetVol: number,
    durationMs: number,
    pauseOnZero = false,
  ) => {
    if (!audio) return;
    const startVol = audio.volume;
    const startTime = performance.now();

    const step = (now: number) => {
      const progress = Math.min(1, (now - startTime) / durationMs);
      const eased = 1 - Math.pow(1 - progress, 3);
      audio.volume = Math.max(
        0,
        Math.min(1, startVol + (targetVol - startVol) * eased),
      );

      if (progress < 1) {
        requestAnimationFrame(step);
      } else if (pauseOnZero && targetVol === 0) {
        audio.pause();
      }
    };

    requestAnimationFrame(step);
  };

  // Inisialisasi Audio Elements
  useEffect(() => {
    const a1 = new Audio(audioSrc);
    a1.loop = true;
    a1.volume = 0;
    a1.preload = "auto";
    track1Ref.current = a1;

    let a2: HTMLAudioElement | null = null;
    if (secondaryAudioSrc) {
      a2 = new Audio(secondaryAudioSrc);
      a2.loop = true;
      a2.volume = 0;
      a2.preload = "auto";
      track2Ref.current = a2;
    }

    const isMuted = () => sessionStorage.getItem(MUTE_STORAGE_KEY) === "true";

    const tryStart = async () => {
      if (isPlayingRef.current || isMuted()) return false;
      const target = activeTrackRef.current === 2 && a2 ? a2 : a1;
      try {
        await target.play();
        setIsPlaying(true);
        isPlayingRef.current = true;
        fadeAudio(target, isSilencedRef.current ? 0.08 : 0.65, 1400);
        return true;
      } catch {
        return false;
      }
    };

    const cleanupListeners = () => {
      window.removeEventListener("pointerdown", onInteract);
      window.removeEventListener("keydown", onInteract);
      window.removeEventListener("touchstart", onInteract);
    };

    const onInteract = async () => {
      const ok = await tryStart();
      if (ok || isMuted()) cleanupListeners();
    };

    tryStart().then((ok) => {
      if (!ok && !isMuted()) {
        window.addEventListener("pointerdown", onInteract, { passive: true });
        window.addEventListener("keydown", onInteract, { passive: true });
        window.addEventListener("touchstart", onInteract, { passive: true });
      }
    });

    return () => {
      cleanupListeners();
      a1.pause();
      a1.src = "";
      if (a2) {
        a2.pause();
        a2.src = "";
      }
    };
  }, [audioSrc, secondaryAudioSrc]);

  // Crossfade otomatis saat activeTrack berubah (Track 1 <-> Track 2) atau momen hening
  useEffect(() => {
    if (!isPlayingRef.current) return;
    const a1 = track1Ref.current;
    const a2 = track2Ref.current;

    if (activeTrack === 2 && a2) {
      if (a2.paused) a2.play().catch(() => {});
      fadeAudio(a1, 0, 1800, true);
      fadeAudio(a2, isSilenced ? 0.08 : 0.72, 2200);
    } else if (a1) {
      if (a1.paused) a1.play().catch(() => {});
      fadeAudio(a2, 0, 1400, true);
      fadeAudio(a1, isSilenced ? 0.06 : 0.65, 1400);
    }
  }, [activeTrack, isSilenced]);

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

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    if (type === "hover") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(760, now);
      osc.frequency.exponentialRampToValueAtTime(420, now + 0.05);
      gain.gain.setValueAtTime(0.012, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.06);
      return;
    }

    osc.type = "triangle";
    osc.frequency.setValueAtTime(type === "portal" ? 587.33 : 440, now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(
      type === "portal" ? 0.06 : 0.035,
      now + 0.08,
    );
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.9);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 2.0);
  };

  const toggleSound = async () => {
    const a1 = track1Ref.current;
    const a2 = track2Ref.current;
    const activeAudio = activeTrack === 2 && a2 ? a2 : a1;
    if (!activeAudio) return;

    if (!isPlaying) {
      try {
        sessionStorage.setItem(MUTE_STORAGE_KEY, "false");
        await activeAudio.play();
        setIsPlaying(true);
        isPlayingRef.current = true;
        fadeAudio(activeAudio, isSilenced ? 0.08 : 0.65, 1100);
      } catch (err) {
        console.error("Audio playback error:", err);
      }
    } else {
      sessionStorage.setItem(MUTE_STORAGE_KEY, "true");
      setIsPlaying(false);
      isPlayingRef.current = false;
      fadeAudio(a1, 0, 600, true);
      fadeAudio(a2, 0, 600, true);
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
      className="group relative inline-flex cursor-pointer items-center gap-2.5 border border-white/20 bg-background/70 text-foreground hover:border-accent px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] backdrop-blur-md transition-all"
    >
      <span className="flex h-3 items-end gap-[2.5px]" aria-hidden="true">
        <span
          className={`w-[1.5px] bg-[#c7a66a] transition-all duration-300 ${
            isPlaying ? "h-3 animate-pulse" : "h-1.5 opacity-50"
          }`}
        />
        <span
          className={`w-[1.5px] bg-[#c7a66a] transition-all duration-500 ${
            isPlaying ? "h-2 animate-bounce" : "h-1 opacity-50"
          }`}
        />
        <span
          className={`w-[1.5px] bg-[#c7a66a] transition-all duration-300 ${
            isPlaying ? "h-3 animate-pulse" : "h-1.5 opacity-50"
          }`}
        />
      </span>

      <span className="hidden sm:inline">
        {isPlaying ? "Audio On" : "Audio Off"}
      </span>
    </button>
  );
}
