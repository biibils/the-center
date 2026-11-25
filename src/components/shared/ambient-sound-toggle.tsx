"use client";

import { useEffect, useRef, useState } from "react";

export function AmbientSoundToggle() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const isPlayingRef = useRef(false);

  // Inisialisasi Web Audio Synthesizer (Warm Architectural Drone)
  const initAudio = () => {
    if (audioCtxRef.current) return;

    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    const ctx = new AudioCtx();
    audioCtxRef.current = ctx;

    // Master Gain untuk fade-in / fade-out mulus
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.0001, ctx.currentTime);
    masterGain.connect(ctx.destination);
    masterGainRef.current = masterGain;

    // Lowpass Filter agar suara terasa hangat, dalam, dan tidak menusuk telinga
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(320, ctx.currentTime);
    filter.Q.setValueAtTime(1.2, ctx.currentTime);
    filter.connect(masterGain);

    // LFO lambat untuk memberi efek "napas" pada ruang observatorium
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.setValueAtTime(0.08, ctx.currentTime); // 1 siklus per ~12 detik
    lfoGain.gain.setValueAtTime(90, ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();

    // Harmoni Nada Dasar D2 (73.42 Hz) + A2 (110 Hz) + E3 (164.81 Hz)
    const frequencies = [73.42, 110.0, 146.83, 164.81];
    frequencies.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();

      osc.type = idx % 2 === 0 ? "sine" : "triangle";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      // Sedikit detune untuk tekstur analog yang organik
      osc.detune.setValueAtTime((idx - 1.5) * 4, ctx.currentTime);

      oscGain.gain.setValueAtTime(idx === 0 ? 0.22 : 0.08, ctx.currentTime);

      osc.connect(oscGain);
      oscGain.connect(filter);
      osc.start();
    });
  };

  // Efek denting kuningan halus saat melewati gerbang babak (Folio I - V)
  const playArchwayChime = (chapterIndex: number) => {
    const ctx = audioCtxRef.current;
    if (!ctx || !isPlayingRef.current || ctx.state !== "running") return;

    // Tangga nada kontemplatif (D4, E4, F4, A4, C5, D5)
    const notes = [293.66, 329.63, 349.23, 440.0, 523.25, 587.33];
    const freq = notes[chapterIndex % notes.length];
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const chimeGain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, now);

    // Envelope lonceng lembut (attack halus, decay panjang)
    chimeGain.gain.setValueAtTime(0.0001, now);
    chimeGain.gain.exponentialRampToValueAtTime(0.045, now + 0.12);
    chimeGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.6);

    osc.connect(chimeGain);
    chimeGain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 2.7);
  };

  const toggleSound = async () => {
    if (!audioCtxRef.current) {
      initAudio();
    }

    const ctx = audioCtxRef.current;
    const masterGain = masterGainRef.current;
    if (!ctx || !masterGain) return;

    if (ctx.state === "suspended") {
      await ctx.resume();
    }

    const now = ctx.currentTime;

    if (!isPlaying) {
      // Fade in 1.5 detik
      masterGain.gain.cancelScheduledValues(now);
      masterGain.gain.setValueAtTime(masterGain.gain.value, now);
      masterGain.gain.exponentialRampToValueAtTime(0.35, now + 1.5);
      setIsPlaying(true);
      isPlayingRef.current = true;
    } else {
      // Fade out 0.8 detik
      masterGain.gain.cancelScheduledValues(now);
      masterGain.gain.setValueAtTime(masterGain.gain.value, now);
      masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);
      setIsPlaying(false);
      isPlayingRef.current = false;
    }
  };

  // Sinkronisasi dengan perpindahan babak 3D
  useEffect(() => {
    const onChapterChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ index: number }>;
      playArchwayChime(customEvent.detail.index);
    };

    window.addEventListener("center:chapter-change", onChapterChange);
    return () => {
      window.removeEventListener("center:chapter-change", onChapterChange);
    };
  }, []);

  // Bersihkan AudioContext saat komponen unmount
  useEffect(() => {
    return () => {
      audioCtxRef.current?.close();
    };
  }, []);

  return (
    <button
      type="button"
      onClick={toggleSound}
      aria-label={isPlaying ? "Matikan suara latar" : "Nyalakan suara latar"}
      title={isPlaying ? "Ambient Audio: On" : "Ambient Audio: Off"}
      className="group inline-flex cursor-pointer items-center gap-2.5 border border-border/80 bg-surface/40 px-3 py-1.5 text-[10px] font-mono uppercase tracking-[0.2em] text-muted backdrop-blur-md transition-colors hover:border-accent hover:text-foreground"
    >
      {/* Equalizer Bars Minimalis */}
      <span className="flex h-3 items-end gap-0.5" aria-hidden="true">
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
            isPlaying ? "h-2.5 animate-pulse" : "h-1.5 opacity-50"
          }`}
        />
      </span>

      <span className="hidden sm:inline">
        {isPlaying ? "Sound On" : "Sound Off"}
      </span>
    </button>
  );
}
