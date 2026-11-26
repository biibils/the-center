"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from "lucide-react";
import { prologueBeats } from "@/content/prologue";
import { Button } from "@/components/ui/button";
import {
  AmbientSoundToggle,
  playCinematicSfx,
} from "@/components/shared/ambient-sound-toggle";
import { FullpageSceneBackdrop } from "./components/fullpage-scene-backdrop";

export function PrologueExperience() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isWhiteout, setIsWhiteout] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const stageRef = useRef<HTMLDivElement>(null);
  const wheelLockRef = useRef<number>(0);
  const touchStartYRef = useRef<number | null>(null);
  const router = useRouter();

  const beat = prologueBeats[currentIndex] ?? prologueBeats[0];
  const progressPercent = ((currentIndex + 1) / prologueBeats.length) * 100;

  // Animasi Fade-In setiap pergantian kalimat / title card
  useEffect(() => {
    if (!stageRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        stageRef.current,
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
    }, stageRef);

    return () => ctx.revert();
  }, [currentIndex]);

  // Trigger SFX transisi saat adegan berganti
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("center:chapter-change", {
        detail: { index: beat.sceneIndex },
      }),
    );
  }, [beat.sceneIndex]);

  const goToBeat = useCallback(
    (nextIndex: number) => {
      if (isAnimating || isWhiteout || isExiting) return;
      if (nextIndex < 0 || nextIndex >= prologueBeats.length) return;
      if (nextIndex === currentIndex) return;

      setIsAnimating(true);

      if (!stageRef.current) {
        setCurrentIndex(nextIndex);
        return;
      }

      gsap.to(stageRef.current, {
        opacity: 0,
        y: nextIndex > currentIndex ? -14 : 14,
        filter: "blur(6px)",
        duration: 0.35,
        ease: "power2.in",
        onComplete: () => {
          setCurrentIndex(nextIndex);
        },
      });
    },
    [currentIndex, isAnimating, isExiting, isWhiteout],
  );

  // Aksi khusus saat tombol [MULAI PERJALANAN] atau [LANJUTKAN] ditekan
  const handleActionTrigger = useCallback(() => {
    if (isAnimating || isWhiteout || isExiting) return;

    // 1. Adegan 04 -> Adegan 05: Efek cahaya putih menembus pintu waktu
    if (beat.actionLabel === "MULAI PERJALANAN") {
      setIsWhiteout(true);
      setIsAnimating(true);
      playCinematicSfx("portal");

      setTimeout(() => {
        setCurrentIndex((prev) => Math.min(prologueBeats.length - 1, prev + 1));
      }, 950);

      setTimeout(() => {
        setIsWhiteout(false);
      }, 1900);
      return;
    }

    // 2. Adegan 06 -> Masuk ke Interlude (/explorer/register)
    if (beat.actionLabel === "LANJUTKAN") {
      setIsExiting(true);
      playCinematicSfx("portal");

      if (stageRef.current) {
        gsap.to(stageRef.current, {
          opacity: 0,
          scale: 1.05,
          filter: "blur(8px)",
          duration: 0.75,
          ease: "power2.in",
        });
      }

      setTimeout(() => {
        router.push("/explorer/register");
      }, 1000);
    }
  }, [beat.actionLabel, isAnimating, isExiting, isWhiteout, router]);

  // Navigasi Scroll Wheel, Touch Swipe, & Keyboard
  useEffect(() => {
    const canAdvanceByScroll = !beat.actionLabel; // Tahan scroll di checkpoint tombol

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (Math.abs(e.deltaY) < 18) return;

      const now = Date.now();
      if (now - wheelLockRef.current < 850) return;
      wheelLockRef.current = now;

      if (e.deltaY > 0) {
        if (canAdvanceByScroll) goToBeat(currentIndex + 1);
      } else {
        goToBeat(currentIndex - 1);
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartYRef.current = e.touches[0]?.clientY ?? null;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (touchStartYRef.current === null) return;
      const diff =
        touchStartYRef.current -
        (e.changedTouches[0]?.clientY ?? touchStartYRef.current);
      touchStartYRef.current = null;

      if (Math.abs(diff) < 35) return;
      if (diff > 0) {
        if (canAdvanceByScroll) goToBeat(currentIndex + 1);
      } else {
        goToBeat(currentIndex - 1);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        if (beat.actionLabel) {
          handleActionTrigger();
        } else {
          goToBeat(currentIndex + 1);
        }
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        goToBeat(currentIndex - 1);
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
  }, [beat.actionLabel, currentIndex, goToBeat, handleActionTrigger]);

  return (
    <main className="relative flex h-screen w-full flex-col justify-between overflow-hidden bg-[#0a0d0c] px-6 py-6 text-[#f3efe5] select-none lg:px-12">
      {/* Fullpage Background Image */}
      <FullpageSceneBackdrop
        currentScene={beat.sceneIndex}
        isWarping={isWhiteout || isExiting}
      />

      {/* Lapisan Cahaya Putih (Whiteout Transisi Menembus Waktu Adegan 04 -> 05) */}
      <div
        aria-hidden="true"
        className={`pointer-events-none fixed inset-0 z-40 bg-[#f7f3ea] transition-opacity duration-1000 ease-in-out ${
          isWhiteout ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* =========================================================
          TOP BAR
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
            {beat.sceneCode} · {beat.sceneTitle}
          </span>

          {/* Pastikan nama file .mp3 di bawah cocok dengan yang ada di public/audio/ */}
          <AmbientSoundToggle
            audioSrc="/audio/prologue-mystery-the-unresolved-evening.mp3"
            secondaryAudioSrc="/audio/prologue-awakening-primordial-wonder.mp3"
            activeTrack={beat.trackPhase ?? 1}
            isSilenced={Boolean(beat.silenceMoment)}
          />
        </div>
      </header>

      {/* =========================================================
          CENTER STAGE: SINGLE-BEAT CINEMATIC STAGE
      ========================================================= */}
      <section className="relative z-20 mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center px-4 text-center">
        {/* Penanda Adegan di Atas */}
        <div className="mb-6 flex items-center gap-3 opacity-85">
          <span className="h-px w-8 bg-[#c7a66a]/70" />
          <span className="font-mono text-[11px] uppercase tracking-[0.35em] text-[#c7a66a]">
            {beat.sceneCode} — {beat.sceneTitle}
          </span>
          <span className="h-px w-8 bg-[#c7a66a]/70" />
        </div>

        {/* Konten Utama (Kalimat / Dialog / Title Card) */}
        <div
          ref={stageRef}
          className="flex min-h-40 w-full flex-col items-center justify-center sm:min-h-45"
        >
          {beat.variant === "title-card" ? (
            <div className="flex flex-col items-center">
              <span className="font-mono text-xs uppercase tracking-[0.4em] text-[#c7a66a]">
                THE CENTER · THE BAITUL MAQDIS JOURNEY
              </span>
              <h1 className="mt-4 font-display text-3xl tracking-[0.08em] text-white drop-shadow-[0_4px_28px_rgba(0,0,0,0.95)] sm:text-5xl md:text-6xl">
                CHAPTER 01
              </h1>
              <p className="mt-2 font-display text-xl tracking-[0.18em] text-[#c7a66a] sm:text-3xl">
                THE FIRST FOUNDATIONS
              </p>
              <p className="mt-4 font-display text-sm italic tracking-[0.15em] text-stone-300 sm:text-base">
                Awal Sejarah Tempat-Tempat Suci
              </p>
            </div>
          ) : (
            <>
              {/* Penanda Pembicara Minimalis (Khusus Adegan 03 & 04) */}
              {beat.speaker && (
                <span
                  className={`mb-4 font-mono text-[11px] uppercase tracking-[0.35em] ${
                    beat.speaker === "THE STRANGER"
                      ? "text-[#c7a66a]"
                      : "text-stone-300"
                  }`}
                >
                  — {beat.speaker} —
                </span>
              )}

              <p
                className={`max-w-3xl font-display text-2xl leading-[1.55] tracking-[0.03em] drop-shadow-[0_4px_28px_rgba(0,0,0,0.95)] sm:text-3xl sm:leading-normal md:text-[2.2rem] ${
                  beat.variant === "english-quote" ||
                  beat.variant === "stranger"
                    ? "italic text-[#f6eedc]"
                    : beat.variant === "question"
                      ? "text-[#e5c990]"
                      : "text-white"
                }`}
              >
                {beat.text}
              </p>
            </>
          )}
        </div>

        {/* Tombol Aksi Checkpoint ([MULAI PERJALANAN] atau [LANJUTKAN]) */}
        <div className="mt-8 flex h-12 items-center justify-center">
          {beat.actionLabel && (
            <Button
              onClick={handleActionTrigger}
              onMouseEnter={() => playCinematicSfx("hover")}
              disabled={isWhiteout || isExiting}
            >
              {beat.actionLabel}
              <ArrowRight size={15} />
            </Button>
          )}
        </div>
      </section>

      {/* =========================================================
          BOTTOM BAR: PROGRESS & NAVIGASI
      ========================================================= */}
      <footer className="relative z-20 flex flex-col gap-3">
        <div className="h-px w-full overflow-hidden bg-white/15">
          <div
            style={{ width: `${progressPercent}%` }}
            className="h-full bg-[#c7a66a] transition-all duration-700 ease-out"
          />
        </div>

        <div className="flex h-8 items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-stone-300">
          <button
            type="button"
            onClick={() => goToBeat(currentIndex - 1)}
            disabled={currentIndex === 0 || isAnimating}
            className="inline-flex cursor-pointer items-center gap-1.5 transition-colors hover:text-white disabled:pointer-events-none disabled:opacity-25"
          >
            <ArrowUp size={12} className="text-[#c7a66a]" />
            <span>Sebelumnya</span>
          </button>

          <span className="flex items-center gap-2 text-stone-200">
            {beat.actionLabel ? (
              `Tekan ${beat.actionLabel}`
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
            onClick={() =>
              beat.actionLabel
                ? handleActionTrigger()
                : goToBeat(currentIndex + 1)
            }
            disabled={isAnimating}
            className="inline-flex cursor-pointer items-center gap-1.5 transition-colors hover:text-[#c7a66a] disabled:pointer-events-none disabled:opacity-25"
          >
            <span>{beat.actionLabel ? beat.actionLabel : "Lanjut"}</span>
            <ArrowDown size={12} className="text-[#c7a66a]" />
          </button>
        </div>
      </footer>
    </main>
  );
}
