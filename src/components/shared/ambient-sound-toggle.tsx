"use client";

import { useEffect, useRef, useState } from "react";

type SfxType = "transition" | "hover" | "portal";

const MUTE_STORAGE_KEY = "center:audio-muted";

let sharedSfxCtx: AudioContext | null = null;

function getSfxContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!sharedSfxCtx) {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (AudioCtx) {
      sharedSfxCtx = new AudioCtx();
    }
  }
  if (sharedSfxCtx && sharedSfxCtx.state === "suspended") {
    sharedSfxCtx.resume().catch(() => {});
  }
  return sharedSfxCtx;
}

export function playCinematicSfx(type: SfxType = "hover", boost = 1.65) {
  if (typeof window === "undefined") return;
  if (sessionStorage.getItem(MUTE_STORAGE_KEY) === "true") return;

  try {
    const ctx = getSfxContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === "hover") {
      // Soft tactile tick
      osc.type = "sine";
      osc.frequency.setValueAtTime(540, now);
      osc.frequency.exponentialRampToValueAtTime(780, now + 0.045);

      const peak = Math.min(0.32, 0.08 * boost);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(peak, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);

      osc.start(now);
      osc.stop(now + 0.065);
    } else if (type === "transition") {
      // Crisp step confirmation chime
      osc.type = "triangle";
      osc.frequency.setValueAtTime(360, now);
      osc.frequency.exponentialRampToValueAtTime(660, now + 0.14);

      const peak = Math.min(0.4, 0.13 * boost);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(peak, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.19);

      osc.start(now);
      osc.stop(now + 0.2);
    } else if (type === "portal") {
      // Deep resonant submit chord
      osc.type = "sine";
      osc.frequency.setValueAtTime(196, now);
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.36);

      const peak = Math.min(0.45, 0.16 * boost);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(peak, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.44);

      osc.start(now);
      osc.stop(now + 0.46);
    }
  } catch {
    // Abaikan jika browser memblokir AudioContext sebelum interaksi
  }
}

interface AmbientSoundToggleProps {
  audioSrc?: string;
  secondaryAudioSrc?: string;
  activeTrack?: 1 | 2;
  isSilenced?: boolean;
  volume?: number;
}

export function AmbientSoundToggle({
  audioSrc = "/audio/landing-the-kingdom-of-wonder.mp3",
  secondaryAudioSrc,
  activeTrack = 1,
  isSilenced = false,
  volume = 0.65,
}: AmbientSoundToggleProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const track1Ref = useRef<HTMLAudioElement | null>(null);
  const track2Ref = useRef<HTMLAudioElement | null>(null);
  const isPlayingRef = useRef(false);
  const activeTrackRef = useRef(activeTrack);
  const isSilencedRef = useRef(isSilenced);
  const volumeRef = useRef(volume);

  useEffect(() => {
    activeTrackRef.current = activeTrack;
    isSilencedRef.current = isSilenced;
    volumeRef.current = volume;
  }, [activeTrack, isSilenced, volume]);

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
        const targetVolume = isSilencedRef.current
          ? Math.min(0.08, volumeRef.current)
          : volumeRef.current;
        fadeAudio(target, targetVolume, 1400);
        return true;
      } catch {
        return false;
      }
    };

    const cleanupListeners = () => {
      window.removeEventListener("pointerdown", onInteract);
      window.removeEventListener("keydown", onInteract);
      window.removeEventListener("touchstart", onInteract);
      window.removeEventListener("center:unlock-audio", onInteract);
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
        window.addEventListener("center:unlock-audio", onInteract);
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

  // Crossfade otomatis saat activeTrack, isSilenced, atau volume berubah
  useEffect(() => {
    if (!isPlayingRef.current) return;
    const a1 = track1Ref.current;
    const a2 = track2Ref.current;

    if (activeTrack === 2 && a2) {
      if (a2.paused) a2.play().catch(() => {});
      fadeAudio(a1, 0, 1800, true);
      fadeAudio(
        a2,
        isSilenced ? Math.min(0.08, volume) : Math.min(1, volume * 1.1),
        2200,
      );
    } else if (a1) {
      if (a1.paused) a1.play().catch(() => {});
      fadeAudio(a2, 0, 1400, true);
      fadeAudio(a1, isSilenced ? Math.min(0.06, volume) : volume, 1400);
    }
  }, [activeTrack, isSilenced, volume]);

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
        fadeAudio(
          activeAudio,
          isSilenced ? Math.min(0.08, volume) : volume,
          1100,
        );
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
      const custom = e as CustomEvent<{ type: SfxType; boost?: number }>;
      playCinematicSfx(custom.detail.type, custom.detail.boost ?? 1.65);
    };
    const onChapterChange = () => playCinematicSfx("transition", 1.5);

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
      className="group relative inline-flex cursor-pointer items-center gap-2.5 border border-white/20 bg-background/70 px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-foreground backdrop-blur-md transition-all hover:border-accent"
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
