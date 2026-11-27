"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { ArrowDown, ArrowRight, ArrowUp } from "lucide-react";
import { prologueBeats } from "@/content/prologue";
import { Button } from "@/components/ui/button";
import {
  AmbientSoundToggle,
  playCinematicSfx,
} from "@/components/shared/ambient-sound-toggle";
import {
  FullpageSceneBackdrop,
  PROLOGUE_BACKDROP_IMAGES,
  PROLOGUE_BACKDROP_VIDEOS,
} from "./components/fullpage-scene-backdrop";
import { TheCenterLogo } from "@/components/shared/the-center-logo";
import { CinematicPreloader } from "@/components/shared/cinematic-preloader";

export function PrologueExperience() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isWhiteout, setIsWhiteout] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const [isScrubbing, setIsScrubbing] = useState(false);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const [isPrologueReady, setIsPrologueReady] = useState(false);

  const stageRef = useRef<HTMLDivElement>(null);
  const scrubberRef = useRef<HTMLDivElement>(null);
  const wheelLockRef = useRef<number>(0);
  const touchStartYRef = useRef<number | null>(null);
  const router = useRouter();

  const beat = prologueBeats[currentIndex] ?? prologueBeats[0];
  const progressPercent =
    prologueBeats.length > 1
      ? (currentIndex / (prologueBeats.length - 1)) * 100
      : 100;

  const sceneMarkers = useMemo(() => {
    const markers: {
      sceneIndex: number;
      beatIndex: number;
      code: string;
      title: string;
      percent: number;
    }[] = [];
    const seen = new Set<number>();

    prologueBeats.forEach((b, idx) => {
      if (!seen.has(b.sceneIndex)) {
        seen.add(b.sceneIndex);
        markers.push({
          sceneIndex: b.sceneIndex,
          beatIndex: idx,
          code: b.sceneCode,
          title: b.sceneTitle,
          percent:
            prologueBeats.length > 1
              ? (idx / (prologueBeats.length - 1)) * 100
              : 0,
        });
      }
    });

    return markers;
  }, []);

  // Transisi masuk teks perlahan & dramatis
  useEffect(() => {
    if (!stageRef.current || !isPrologueReady) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        stageRef.current,
        {
          opacity: 0,
          y: 16,
          scale: 0.985,
          filter: "blur(5px)",
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: isScrubbing ? 0.28 : 1.15,
          ease: "power2.out",
          onComplete: () => setIsAnimating(false),
        },
      );
    }, stageRef);

    return () => ctx.revert();
  }, [currentIndex, isPrologueReady, isScrubbing]);

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("center:chapter-change", {
        detail: { index: beat.sceneIndex },
      }),
    );
  }, [beat.sceneIndex]);

  const goToBeat = useCallback(
    (nextIndex: number, instant = false) => {
      if ((!instant && isAnimating) || isWhiteout || isExiting) return;
      if (nextIndex < 0 || nextIndex >= prologueBeats.length) return;
      if (nextIndex === currentIndex) return;

      if (instant || !stageRef.current) {
        setCurrentIndex(nextIndex);
        return;
      }

      setIsAnimating(true);

      gsap.to(stageRef.current, {
        opacity: 0,
        y: nextIndex > currentIndex ? -10 : 10,
        filter: "blur(4px)",
        duration: 0.38,
        ease: "power2.inOut",
        onComplete: () => {
          setCurrentIndex(nextIndex);
        },
      });
    },
    [currentIndex, isAnimating, isExiting, isWhiteout],
  );

  const calculateIndexFromClientX = useCallback((clientX: number) => {
    if (!scrubberRef.current) return 0;
    const rect = scrubberRef.current.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    return Math.round(ratio * (prologueBeats.length - 1));
  }, []);

  const handleScrubberPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isWhiteout || isExiting) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsScrubbing(true);
    playCinematicSfx("hover");
    goToBeat(calculateIndexFromClientX(e.clientX), true);
  };

  const handleScrubberPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const targetIdx = calculateIndexFromClientX(e.clientX);
    setHoverIndex(targetIdx);
    if (isScrubbing) goToBeat(targetIdx, true);
  };

  const handleScrubberPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isScrubbing) return;
    e.currentTarget.releasePointerCapture(e.pointerId);
    setIsScrubbing(false);
    playCinematicSfx("hover");
  };

  const handleActionTrigger = useCallback(() => {
    if (isAnimating || isWhiteout || isExiting) return;

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

    if (beat.actionLabel === "LANJUTKAN") {
      setIsExiting(true);
      playCinematicSfx("portal");

      if (stageRef.current) {
        gsap.to(stageRef.current, {
          opacity: 0,
          scale: 1.04,
          filter: "blur(6px)",
          duration: 0.75,
          ease: "power2.in",
        });
      }

      setTimeout(() => {
        router.push("/explorer/register");
      }, 1000);
    }
  }, [beat.actionLabel, isAnimating, isExiting, isWhiteout, router]);

  useEffect(() => {
    const canAdvanceByScroll = !beat.actionLabel;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (Math.abs(e.deltaY) < 18) return;

      const now = Date.now();
      if (now - wheelLockRef.current < 900) return;
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
  }, [
    beat.actionLabel,
    currentIndex,
    goToBeat,
    handleActionTrigger,
    isPrologueReady,
  ]);

  const hoveredBeat =
    hoverIndex !== null ? prologueBeats[hoverIndex] : undefined;
  const isTitleCard = beat.variant === "title-card";

  return (
    <main className="relative flex h-screen w-full flex-col justify-between overflow-hidden bg-[#070908] px-6 py-10 text-[#f7f3ea] select-none lg:px-12">
      <CinematicPreloader
        subtitle="MEMASUKI BABAK PROLOG..."
        images={PROLOGUE_BACKDROP_IMAGES}
        videos={PROLOGUE_BACKDROP_VIDEOS}
        audios={[
          "/audio/prologue-mystery-the-unresolved-evening.mp3",
          "/audio/prologue-awakening-primordial-wonder.mp3",
        ]}
        onComplete={() => setIsPrologueReady(true)}
      />

      {/* Fullpage Background Image */}
      <FullpageSceneBackdrop
        currentScene={beat.sceneIndex}
        isWarping={isWhiteout || isExiting}
      />

      {/* =========================================================
          CINEMATIC GRADIENT SCRIMS (Menjaga Atas Jernih, Bawah Terbaca)
      ========================================================= */}
      {/* Scrim Atas Tipis untuk Header */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 z-10 h-28 bg-linear-to-b from-[#070908]/75 via-[#070908]/30 to-transparent"
      />

      {/* Scrim Bawah Bertingkat (Lower-Third Subtitle Area) */}
      <div
        aria-hidden="true"
        className={`pointer-events-none fixed inset-x-0 bottom-0 z-10 transition-all duration-700 ${
          isTitleCard
            ? "h-screen bg-radial from-[#070908]/75 via-[#070908]/45 to-[#070908]/70"
            : "h-[52vh] bg-linear-to-t from-[#070908]/95 via-[#070908]/68 to-transparent"
        }`}
      />

      {/* Bingkai Ornamen Sudut RPG Tipis */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-5 z-10 hidden border border-white/12 md:block lg:inset-8"
      >
        <span className="absolute -left-px -top-px h-3.5 w-3.5 border-l border-t border-[#e0be7b]/85" />
        <span className="absolute -right-px -top-px h-3.5 w-3.5 border-r border-t border-[#e0be7b]/85" />
        <span className="absolute -bottom-px -left-px h-3.5 w-3.5 border-b border-l border-[#e0be7b]/85" />
        <span className="absolute -bottom-px -right-px h-3.5 w-3.5 border-b border-r border-[#e0be7b]/85" />
      </div>

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
          className="group inline-flex items-center gap-3 text-white transition-colors hover:text-[#e6c687]"
        >
          <TheCenterLogo href="" size="sm" />
        </Link>

        <div className="hidden items-center gap-3 md:flex">
          <span className="h-px w-8 bg-linear-to-r from-transparent to-[#e0be7b]/80" />
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.32em] text-[#f0d399]">
            {beat.sceneCode} · {beat.sceneTitle}
          </span>
          <span className="h-px w-8 bg-linear-to-l from-transparent to-[#e0be7b]/80" />
        </div>

        <div className="flex items-center gap-4">
          <AmbientSoundToggle
            audioSrc="/audio/prologue-mystery-the-unresolved-evening.mp3"
            secondaryAudioSrc="/audio/prologue-awakening-primordial-wonder.mp3"
            activeTrack={beat.trackPhase ?? 1}
            isSilenced={Boolean(beat.silenceMoment)}
          />
        </div>
      </header>

      {/* =========================================================
          STAGE UTAMA (NARASI VS DIALOG RPG)
      ========================================================= */}
      <section
        className={`relative z-20 mx-auto flex w-full max-w-3xl flex-1 flex-col items-center px-4 text-center ${
          isTitleCard ? "justify-center" : "justify-end pb-2 sm:pb-4"
        }`}
      >
        <div
          ref={stageRef}
          className="relative flex w-full flex-col items-center justify-center px-2 py-2"
        >
          {isTitleCard ? (
            <div className="flex flex-col items-center">
              <span className="font-mono text-xs font-semibold uppercase tracking-[0.42em] text-[#f0d399]">
                THE CENTER
              </span>
              <h1 className="mt-4 font-display text-5xl tracking-[0.18em] text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.85)] sm:text-6xl md:text-[4.5rem]">
                PROLOGUE
              </h1>
              <p className="mt-2 font-display text-lg tracking-[0.28em] text-[#f0d399] sm:text-2xl">
                WHERE HISTORY BEGINS
              </p>
              <div className="my-5 flex items-center gap-3 text-[#e0be7b]">
                <span className="h-px w-14 bg-linear-to-r from-transparent to-[#e0be7b]/85" />
                <span className="text-[10px]">◆</span>
                <span className="h-px w-14 bg-linear-to-l from-transparent to-[#e0be7b]/85" />
              </div>
              <p className="max-w-md font-narrative text-base italic tracking-[0.04em] text-stone-200 sm:text-lg">
                “Di bumi yang sunyi ini, kamu baru saja mulai.”
              </p>
            </div>
          ) : beat.variant === "stranger" || beat.variant === "explorer" ? (
            /* =====================================================
               MODE DIALOG PERCAKAPAN (THE STRANGER vs EXPLORER)
            ===================================================== */
            <div className="flex w-full flex-col items-center">
              {/* Speaker Nameplate RPG */}
              <div className="mb-4 flex items-center gap-3">
                <span
                  className={`h-px w-8 sm:w-12 bg-linear-to-r from-transparent ${
                    beat.variant === "stranger"
                      ? "to-[#e0be7b]/75"
                      : "to-sky-300/65"
                  }`}
                />
                <div
                  className={`inline-flex items-center gap-2 border px-3.5 py-1 backdrop-blur-xs ${
                    beat.variant === "stranger"
                      ? "border-[#e0be7b]/45 bg-[#e0be7b]/10 text-[#f5d99e]"
                      : "border-sky-300/40 bg-sky-400/10 text-sky-200"
                  }`}
                >
                  <span className="text-[10px]">
                    {beat.variant === "stranger" ? "✦" : "◈"}
                  </span>
                  <span className="font-mono text-[11px] font-bold uppercase tracking-[0.3em]">
                    {beat.speaker}
                  </span>
                </div>
                <span
                  className={`h-px w-8 sm:w-12 bg-linear-to-l from-transparent ${
                    beat.variant === "stranger"
                      ? "to-[#e0be7b]/75"
                      : "to-sky-300/65"
                  }`}
                />
              </div>

              {/* Teks Dialog dengan Quotation Mark Beraksen */}
              <p
                className={`max-w-2xl font-narrative text-xl leading-[1.65] tracking-[0.015em] sm:text-2xl sm:leading-[1.7] md:text-[1.6rem] ${
                  beat.variant === "stranger"
                    ? "italic text-[#fcf4e3]"
                    : "not-italic font-medium text-white"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`mr-1 font-display text-2xl leading-none sm:text-3xl ${
                    beat.variant === "stranger"
                      ? "text-[#e0be7b]"
                      : "text-sky-300/85"
                  }`}
                >
                  “
                </span>
                {beat.text}
                <span
                  aria-hidden="true"
                  className={`ml-1 font-display text-2xl leading-none sm:text-3xl ${
                    beat.variant === "stranger"
                      ? "text-[#e0be7b]"
                      : "text-sky-300/85"
                  }`}
                >
                  ”
                </span>
              </p>

              {/* Garis Aksen Bawah sesuai Pembicara */}
              <div
                aria-hidden="true"
                className="mt-5 flex items-center gap-2.5 opacity-80"
              >
                <span
                  className={`h-px w-12 bg-linear-to-r from-transparent ${
                    beat.variant === "stranger"
                      ? "to-[#e0be7b]"
                      : "to-sky-300/80"
                  }`}
                />
                <span
                  className={`h-1.5 w-1.5 rotate-45 border ${
                    beat.variant === "stranger"
                      ? "border-[#e0be7b]"
                      : "border-sky-300"
                  }`}
                />
                <span
                  className={`h-px w-12 bg-linear-to-l from-transparent ${
                    beat.variant === "stranger"
                      ? "to-[#e0be7b]"
                      : "to-sky-300/80"
                  }`}
                />
              </div>
            </div>
          ) : (
            /* =====================================================
               MODE NARASI & PERTANYAAN REFLEKTIF (TANPA KUTIP)
            ===================================================== */
            <div className="flex w-full flex-col items-center">
              {/* Ornamen Garis Tipis Narasi */}
              <div
                aria-hidden="true"
                className="mb-3 flex items-center gap-3 opacity-75"
              >
                <span className="h-px w-10 bg-linear-to-r from-transparent to-[#e0be7b]" />
                <span className="h-1.5 w-1.5 rotate-45 border border-[#e0be7b]" />
                <span className="h-px w-10 bg-linear-to-l from-transparent to-[#e0be7b]" />
              </div>

              {beat.variant === "english-quote" ? (
                <p className="max-w-2xl font-display text-2xl italic leading-relaxed tracking-[0.04em] text-[#f5d99e] sm:text-3xl">
                  “{beat.text}”
                </p>
              ) : (
                <p
                  className={`max-w-2xl font-narrative text-xl leading-[1.65] tracking-[0.015em] sm:text-2xl sm:leading-[1.7] md:text-[1.55rem] ${
                    beat.variant === "question"
                      ? "font-medium text-[#f5da9f]"
                      : "font-normal text-stone-100"
                  }`}
                >
                  {beat.text}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Tombol Aksi Checkpoint ([MULAI PERJALANAN] atau [LANJUTKAN]) */}
        {beat.actionLabel && (
          <div className="mt-4 flex items-center justify-center">
            <Button
              onClick={handleActionTrigger}
              onMouseEnter={() => playCinematicSfx("hover")}
              disabled={isWhiteout || isExiting}
            >
              {beat.actionLabel}
              <ArrowRight size={15} />
            </Button>
          </div>
        )}
      </section>

      {/* =========================================================
          BOTTOM BAR: INTERACTIVE SCRUBBER & NAVIGASI
      ========================================================= */}
      <footer className="relative z-20 flex flex-col gap-2.5">
        <div
          ref={scrubberRef}
          onPointerDown={handleScrubberPointerDown}
          onPointerMove={handleScrubberPointerMove}
          onPointerUp={handleScrubberPointerUp}
          onPointerLeave={() => {
            if (!isScrubbing) setHoverIndex(null);
          }}
          role="slider"
          aria-label="Timeline Prologue"
          aria-valuemin={1}
          aria-valuemax={prologueBeats.length}
          aria-valuenow={currentIndex + 1}
          tabIndex={0}
          className="group relative flex h-6 w-full cursor-pointer items-center touch-none"
        >
          {hoveredBeat && hoverIndex !== null && (
            <div
              style={{
                left: `${
                  prologueBeats.length > 1
                    ? (hoverIndex / (prologueBeats.length - 1)) * 100
                    : 0
                }%`,
              }}
              className="pointer-events-none absolute -top-9 -translate-x-1/2 whitespace-nowrap border border-[#e0be7b]/50 bg-[#0a0d0c]/95 px-2.5 py-1 font-mono text-[10px] tracking-[0.18em] text-[#f5d99e]"
            >
              {hoveredBeat.sceneCode} · {hoverIndex + 1}/{prologueBeats.length}
            </div>
          )}

          <div className="relative h-0.5 w-full bg-white/25 transition-all duration-200 group-hover:h-1">
            <div
              style={{ width: `${progressPercent}%` }}
              className={`h-full bg-[#e0be7b] ${
                isScrubbing
                  ? "transition-none"
                  : "transition-all duration-500 ease-out"
              }`}
            />

            {sceneMarkers.map((marker) => (
              <span
                key={marker.sceneIndex}
                style={{ left: `${marker.percent}%` }}
                className={`pointer-events-none absolute top-1/2 h-2 w-0.5 -translate-x-1/2 -translate-y-1/2 transition-colors ${
                  currentIndex >= marker.beatIndex ? "bg-white" : "bg-white/45"
                }`}
              />
            ))}

            <span
              style={{ left: `${progressPercent}%` }}
              className={`pointer-events-none absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rotate-45 border border-white bg-[#e0be7b] shadow-[0_0_10px_rgba(224,190,123,0.95)] ${
                isScrubbing
                  ? "scale-125 transition-none"
                  : "scale-90 transition-all duration-300 group-hover:scale-110"
              }`}
            />
          </div>
        </div>

        <div className="flex h-7 items-center justify-between font-mono text-[10px] font-medium uppercase tracking-[0.25em] text-stone-300">
          <button
            type="button"
            onClick={() => goToBeat(currentIndex - 1)}
            disabled={currentIndex === 0 || isAnimating}
            className="inline-flex cursor-pointer items-center gap-1.5 transition-colors hover:text-[#f0d399] disabled:pointer-events-none disabled:opacity-30"
          >
            <ArrowUp size={12} className="text-[#e0be7b]" />
            <span>Sebelumnya</span>
          </button>

          <span className="flex items-center gap-2 text-stone-200">
            {beat.actionLabel ? (
              `Tekan ${beat.actionLabel}`
            ) : (
              <>
                <span className="hidden sm:inline">
                  Scroll atau Geser Timeline ·
                </span>
                <span className="text-[#f0d399]">
                  {currentIndex + 1} / {prologueBeats.length}
                </span>
                <ArrowDown
                  size={12}
                  className="animate-bounce text-[#e0be7b]"
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
            className="inline-flex cursor-pointer items-center gap-1.5 transition-colors hover:text-[#f0d399] disabled:pointer-events-none disabled:opacity-30"
          >
            <span>{beat.actionLabel ? beat.actionLabel : "Lanjut"}</span>
            <ArrowDown size={12} className="text-[#e0be7b]" />
          </button>
        </div>
      </footer>
    </main>
  );
}
