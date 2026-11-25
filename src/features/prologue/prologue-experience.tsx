"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from "lucide-react";
import { prologueScenes } from "@/content/prologue";
import { Button } from "@/components/ui/button";
import {
  AmbientSoundToggle,
  playCinematicSfx,
} from "@/components/shared/ambient-sound-toggle";
import { FullpageSceneBackdrop } from "./components/fullpage-scene-backdrop";

interface StoryBeat {
  sceneIndex: number;
  eyebrow: string;
  title: string;
  sentence: string;
  isFirstInScene: boolean;
}

export function PrologueExperience() {
  const [currentBeat, setCurrentBeat] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isWarping, setIsWarping] = useState(false);

  const sentenceBoxRef = useRef<HTMLDivElement>(null);
  const wheelLockRef = useRef<number>(0);
  const touchStartYRef = useRef<number | null>(null);
  const router = useRouter();

  // Ratakan semua adegan menjadi urutan kalimat tunggal (1 kalimat per step)
  const beats = useMemo<StoryBeat[]>(() => {
    const list: StoryBeat[] = [];

    prologueScenes.forEach((scene, sceneIndex) => {
      const sceneSentences = scene.paragraphs.flatMap((paragraph) => {
        const matches = paragraph.match(/[^.!?]+[.!?]+|[^.!?]+$/g);
        return matches
          ? matches.map((s) => s.trim()).filter(Boolean)
          : [paragraph];
      });

      sceneSentences.forEach((sentence, sIdx) => {
        list.push({
          sceneIndex,
          eyebrow: scene.eyebrow,
          title: scene.title,
          sentence,
          isFirstInScene: sIdx === 0,
        });
      });
    });

    return list;
  }, []);

  const activeBeat = beats[currentBeat] ?? beats[0];
  const isLastBeat = currentBeat === beats.length - 1;
  const progressPercent = ((currentBeat + 1) / beats.length) * 100;

  // Animasi Fade-In Kalimat di Tengah Layar
  useEffect(() => {
    if (!sentenceBoxRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        sentenceBoxRef.current,
        {
          opacity: 0,
          y: 16,
          scale: 0.985,
          filter: "blur(6px)",
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: 0.85,
          ease: "power3.out",
          onComplete: () => setIsAnimating(false),
        },
      );
    }, sentenceBoxRef);

    return () => ctx.revert();
  }, [currentBeat]);

  // Bunyikan resonansi halus hanya saat berpindah ke adegan baru
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("center:chapter-change", {
        detail: { index: activeBeat.sceneIndex },
      }),
    );
  }, [activeBeat.sceneIndex]);

  const enterPortal = useCallback(() => {
    if (isWarping) return;
    setIsWarping(true);
    setIsAnimating(true);
    playCinematicSfx("portal");

    if (sentenceBoxRef.current) {
      gsap.to(sentenceBoxRef.current, {
        opacity: 0,
        scale: 1.06,
        filter: "blur(10px)",
        duration: 0.8,
        ease: "power2.in",
      });
    }

    setTimeout(() => {
      router.push("/explorer/register");
    }, 1250);
  }, [isWarping, router]);

  const stepToBeat = useCallback(
    (nextIndex: number) => {
      if (isAnimating || isWarping) return;

      if (nextIndex >= beats.length) {
        enterPortal();
        return;
      }

      if (nextIndex < 0 || nextIndex === currentBeat) return;

      setIsAnimating(true);

      if (!sentenceBoxRef.current) {
        setCurrentBeat(nextIndex);
        return;
      }

      gsap.to(sentenceBoxRef.current, {
        opacity: 0,
        y: nextIndex > currentBeat ? -14 : 14,
        filter: "blur(6px)",
        duration: 0.35,
        ease: "power2.in",
        onComplete: () => {
          setCurrentBeat(nextIndex);
        },
      });
    },
    [beats.length, currentBeat, enterPortal, isAnimating, isWarping],
  );

  // Trigger via Scroll Wheel / Trackpad (1 scroll gesture = 1 kalimat)
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (Math.abs(e.deltaY) < 18) return;

      const now = Date.now();
      if (now - wheelLockRef.current < 850) return;
      wheelLockRef.current = now;

      if (e.deltaY > 0) {
        stepToBeat(currentBeat + 1);
      } else {
        stepToBeat(currentBeat - 1);
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartYRef.current = e.touches[0]?.clientY ?? null;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (touchStartYRef.current === null) return;
      const endY = e.changedTouches[0]?.clientY ?? touchStartYRef.current;
      const diff = touchStartYRef.current - endY;
      touchStartYRef.current = null;

      if (Math.abs(diff) < 35) return;
      if (diff > 0) {
        stepToBeat(currentBeat + 1);
      } else {
        stepToBeat(currentBeat - 1);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        stepToBeat(currentBeat + 1);
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        stepToBeat(currentBeat - 1);
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentBeat, stepToBeat]);

  return (
    <main className="relative flex h-screen w-full flex-col justify-between overflow-hidden bg-[#0a0d0c] px-6 py-6 text-[#f3efe5] select-none lg:px-12">
      {/* Fullpage Background Image yang Jelas & Menyatu */}
      <FullpageSceneBackdrop
        currentScene={activeBeat.sceneIndex}
        isWarping={isWarping}
      />

      {/* =========================================================
          TOP BAR MINIMALIS
      ========================================================= */}
      <header className="relative z-20 flex h-12 items-center justify-between">
        <Link
          href="/"
          onMouseEnter={() => playCinematicSfx("hover")}
          className="group inline-flex items-center gap-3 text-stone-200 transition-colors hover:text-white"
        >
          <ArrowLeft
            size={14}
            className="text-[#c7a66a] transition-transform duration-300 group-hover:-translate-x-1"
          />
          <span className="font-display text-sm tracking-[0.24em] text-white">
            THE CENTER
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <span className="hidden font-mono text-[11px] uppercase tracking-[0.28em] text-[#c7a66a] sm:inline">
            {activeBeat.eyebrow} · {activeBeat.title}
          </span>

          {/* Pastikan nama file mp3 sama dengan yang ada di public/audio/ */}
          <AmbientSoundToggle audioSrc="/audio/prologue-theme-the-clockwork-overture.mp3" />
        </div>
      </header>

      {/* =========================================================
          CENTER STAGE: SATU KALIMAT TUNGGAL DI TENGAH LAYAR
      ========================================================= */}
      <section className="relative z-20 mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center px-4 text-center">
        {/* Penanda Babak */}
        <div className="mb-6 flex items-center gap-3 opacity-85">
          <span className="h-px w-8 bg-[#c7a66a]/70" />
          <span className="font-mono text-[11px] uppercase tracking-[0.35em] text-[#c7a66a]">
            {activeBeat.eyebrow} — {activeBeat.title}
          </span>
          <span className="h-px w-8 bg-[#c7a66a]/70" />
        </div>

        {/* Kalimat Utama menggunakan Font Display (Cinzel) */}
        <div
          ref={sentenceBoxRef}
          className="flex min-h-32.5 items-center justify-center sm:min-h-37.5"
        >
          <p className="max-w-3xl font-display text-2xl font-normal leading-[1.55] tracking-[0.03em] text-white drop-shadow-[0_4px_28px_rgba(0,0,0,0.95)] sm:text-3xl sm:leading-normal md:text-[2.2rem]">
            {activeBeat.sentence}
          </p>
        </div>

        {/* Tombol Portal muncul khusus pada kalimat terakhir */}
        <div className="mt-8 flex h-12 items-center justify-center">
          {isLastBeat && (
            <Button
              onClick={enterPortal}
              onMouseEnter={() => playCinematicSfx("hover")}
              disabled={isWarping}
            >
              Masuki Sejarah
              <ArrowRight size={15} />
            </Button>
          )}
        </div>
      </section>

      {/* =========================================================
          BOTTOM BAR: PROGRESS LINE & SCROLL PROMPT
      ========================================================= */}
      <footer className="relative z-20 flex flex-col gap-3">
        {/* Garis Progres Tipis Sepanjang Cerita */}
        <div className="h-px w-full overflow-hidden bg-white/15">
          <div
            style={{ width: `${progressPercent}%` }}
            className="h-full bg-[#c7a66a] transition-all duration-700 ease-out"
          />
        </div>

        <div className="flex h-8 items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-stone-300">
          <button
            type="button"
            onClick={() => stepToBeat(currentBeat - 1)}
            disabled={currentBeat === 0 || isAnimating}
            className="inline-flex cursor-pointer items-center gap-1.5 transition-colors hover:text-white disabled:pointer-events-none disabled:opacity-25"
          >
            <ArrowUp size={12} className="text-[#c7a66a]" />
            <span>Sebelumnya</span>
          </button>

          <span className="flex items-center gap-2 text-stone-200">
            {isLastBeat ? (
              "Akhir Prolog"
            ) : (
              <>
                Scroll untuk Melanjutkan
                <ArrowDown
                  size={12}
                  className="animate-bounce text-[#c7a66a]"
                />
              </>
            )}
          </span>

          <button
            type="button"
            onClick={() => stepToBeat(currentBeat + 1)}
            disabled={isAnimating}
            className="inline-flex cursor-pointer items-center gap-1.5 transition-colors hover:text-[#c7a66a] disabled:pointer-events-none disabled:opacity-25"
          >
            <span>{isLastBeat ? "Masuk" : "Lanjut"}</span>
            <ArrowDown size={12} className="text-[#c7a66a]" />
          </button>
        </div>
      </footer>
    </main>
  );
}
