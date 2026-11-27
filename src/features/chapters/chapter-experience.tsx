"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookMarked,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  MapPin,
  Search,
  Sparkles,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { TheCenterLogo } from "@/components/shared/the-center-logo";
import {
  AmbientSoundToggle,
  playCinematicSfx,
} from "@/components/shared/ambient-sound-toggle";
import { WorldMap } from "@/features/chapters/world-map";
import { SourceReferenceModal } from "@/features/chapters/source-reference-modal";
import { chapter01 } from "@/content/chapters/chapter-01";
import {
  InteractiveScene,
  type SceneObject,
} from "@/features/exploration/interactive-scene";
import { InvestigationChallengeExperience } from "@/features/challenges/investigation-challenge";
import { chapter01Challenge } from "@/content/chapters/chapter-01-challenge";
import {
  completeChapter,
  getExplorerProgress,
} from "@/features/explorer/progression-service";

type DossierTab = "story" | "discoveries";

export function ChapterExperience() {
  const [activeLocationId, setActiveLocationId] = useState(
    chapter01.locations[0].id,
  );
  const [visitedLocationIds, setVisitedLocationIds] = useState<string[]>([
    chapter01.locations[0].id,
  ]);
  const [dossierTab, setDossierTab] = useState<DossierTab>("story");
  const [storyStep, setStoryStep] = useState(0);
  const [isSourceModalOpen, setIsSourceModalOpen] = useState(false);

  const [isChapterCompleted, setIsChapterCompleted] = useState(() =>
    getExplorerProgress().completedChapters.includes("chapter-01"),
  );

  const activeLocation =
    chapter01.locations.find((location) => location.id === activeLocationId) ??
    chapter01.locations[0];

  const currentIndex = chapter01.locations.findIndex(
    (location) => location.id === activeLocationId,
  );

  const totalSegments = activeLocation.storySegments.length;
  const safeStoryIndex = Math.min(storyStep, totalSegments - 1);

  const bakkahObjects: SceneObject[] = [
    {
      id: "quran-verse",
      label: "Petunjuk Nama Purba",
      description:
        "Al-Qur'an menyebut kawasan inti ini dengan nama Bakkah—sebuah penamaan yang menyimpan jejak sejarah tentang keramaian manusia dan keruntuhan kesombongan.",
      position: { x: 50, y: 35 },
    },
    {
      id: "sacred-valley",
      label: "Lembah yang Diberkahi",
      description:
        "Meski berada di cekungan batu tanpa pepohonan, lembah ini ditetapkan sebagai titik orientasi ibadah pertama bagi seluruh umat manusia.",
      position: { x: 25, y: 65 },
    },
    {
      id: "historical-question",
      label: "Jejak Fondasi Awal",
      description:
        "Kapan dan oleh siapa rumah suci ini pertama kali diletakkan? Pertanyaan ini akan menghubungkan Bakkah dengan Baitul Maqdis di utara.",
      position: { x: 75, y: 60 },
    },
  ];

  function selectLocation(locationId: string) {
    setActiveLocationId(locationId);
    setStoryStep(0);
    setDossierTab("story");
    setVisitedLocationIds((prev) =>
      prev.includes(locationId) ? prev : [...prev, locationId],
    );
  }

  function handleNext() {
    if (currentIndex < chapter01.locations.length - 1) {
      playCinematicSfx("transition");
      selectLocation(chapter01.locations[currentIndex + 1].id);
    }
  }

  function handlePrevious() {
    if (currentIndex > 0) {
      playCinematicSfx("transition");
      selectLocation(chapter01.locations[currentIndex - 1].id);
    }
  }

  return (
    <main className="min-h-screen bg-[#060807] text-[#f7f3ea] selection:bg-[#e0be7b]/30 selection:text-white">
      {/* =========================================================
          TOP HUD BAR
      ========================================================= */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#060807]/90 backdrop-blur-md">
        <Container>
          <div className="flex h-16 items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <TheCenterLogo size="sm" />
              <span className="hidden text-white/20 md:inline">/</span>
              <span className="hidden font-mono text-[10px] uppercase tracking-[0.26em] text-[#e0be7b] md:inline">
                CHAPTER {chapter01.number}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/explorer/hub"
                onMouseEnter={() => playCinematicSfx("hover")}
                className="inline-flex items-center gap-1.5 border border-white/15 bg-white/3 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-stone-300 transition-colors hover:border-[#e0be7b]/60 hover:text-[#f5d99e]"
              >
                <ArrowLeft size={12} className="text-[#e0be7b]" />
                <span>Explorer Hub</span>
              </Link>

              <AmbientSoundToggle
                audioSrc="/audio/main-theme-the-discovery.mp3"
                activeTrack={1}
              />
            </div>
          </div>
        </Container>
      </header>

      {/* =========================================================
          MAIN CONTENT
      ========================================================= */}
      <div className="py-10 sm:py-14">
        <Container>
          {/* Clean Chapter Header */}
          <header className="mb-10 flex flex-col justify-between gap-4 border-b border-white/10 pb-8 lg:flex-row lg:items-end">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="bg-[#e0be7b] px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-[#070908]">
                  CHAPTER {chapter01.number}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#e0be7b]">
                  THE FIRST FOUNDATIONS
                </span>
                {isChapterCompleted && (
                  <span className="inline-flex items-center gap-1 border border-emerald-400/40 bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-300">
                    <CheckCircle2 size={11} />
                    COMPLETED
                  </span>
                )}
              </div>

              <h1 className="mt-3 font-display text-3xl tracking-[0.02em] text-white sm:text-5xl">
                {chapter01.title}
              </h1>
              <p className="mt-1 font-narrative text-lg italic text-[#e0be7b]">
                {chapter01.subtitle}
              </p>
            </div>

            <p className="max-w-md font-narrative text-sm leading-relaxed text-stone-300 sm:text-base">
              {chapter01.description}
            </p>
          </header>

          {/* =========================================================
              BALANCED 2-COLUMN WORKSPACE (MAP LEFT, STORY RIGHT)
          ========================================================= */}
          <section className="grid gap-8 lg:grid-cols-2 lg:items-start">
            {/* LEFT: BLUEPRINT MAP */}
            <div>
              <WorldMap
                locations={chapter01.locations}
                activeLocationId={activeLocationId}
                visitedLocationIds={visitedLocationIds}
                onSelectLocation={selectLocation}
              />
            </div>

            {/* RIGHT: CLEAN CHRONICLE READER */}
            <article className="flex flex-col border border-white/12 bg-[#0b0e0c] p-6 sm:p-8">
              {/* Top Meta & Source Modal Button */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-[#e0be7b]">
                  <MapPin size={12} />
                  LOKASI {activeLocation.number} · {activeLocation.regionLabel}
                </span>

                <button
                  type="button"
                  onClick={() => {
                    playCinematicSfx("transition");
                    setIsSourceModalOpen(true);
                  }}
                  onMouseEnter={() => playCinematicSfx("hover")}
                  className="inline-flex cursor-pointer items-center gap-1.5 border border-[#e0be7b]/45 bg-[#e0be7b]/10 px-3 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[#f5d99e] transition-colors hover:border-[#f5d99e] hover:bg-[#e0be7b]/20"
                >
                  <BookMarked size={12} className="text-[#e0be7b]" />
                  <span>Sumber & Catatan Ulama</span>
                </button>
              </div>

              {/* Title & Lead */}
              <h2 className="mt-4 font-display text-3xl text-white">
                {activeLocation.title}
              </h2>
              <p className="mt-1 font-narrative text-base italic text-[#f0d399]/85">
                {activeLocation.subtitle}
              </p>
              <p className="mt-4 font-narrative text-sm leading-relaxed text-stone-300 sm:text-base">
                {activeLocation.description}
              </p>

              {/* Simple 2-Tab Bar */}
              <div className="mt-6 flex gap-6 border-b border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    playCinematicSfx("hover");
                    setDossierTab("story");
                  }}
                  className={`flex cursor-pointer items-center gap-2 border-b-2 pb-3 font-mono text-[11px] uppercase tracking-[0.2em] transition-colors ${
                    dossierTab === "story"
                      ? "border-[#f5d99e] font-semibold text-[#f5d99e]"
                      : "border-transparent text-stone-400 hover:text-stone-200"
                  }`}
                >
                  <BookOpen size={13} />
                  <span>Kisah & Hikmah</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    playCinematicSfx("hover");
                    setDossierTab("discoveries");
                  }}
                  className={`flex cursor-pointer items-center gap-2 border-b-2 pb-3 font-mono text-[11px] uppercase tracking-[0.2em] transition-colors ${
                    dossierTab === "discoveries"
                      ? "border-[#f5d99e] font-semibold text-[#f5d99e]"
                      : "border-transparent text-stone-400 hover:text-stone-200"
                  }`}
                >
                  <Search size={13} />
                  <span>Temuan ({activeLocation.discoveries.length})</span>
                </button>
              </div>

              {/* TAB 1: STORYTELLING & HIKMAH */}
              {dossierTab === "story" && (
                <div className="mt-6 space-y-6">
                  {/* Narrative Paragraphs with Clean Stepper */}
                  <div className="min-h-40">
                    <p className="font-narrative text-base leading-[1.9] text-stone-100">
                      {activeLocation.storySegments[safeStoryIndex]}
                    </p>

                    {totalSegments > 1 && (
                      <div className="mt-5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {activeLocation.storySegments.map((_, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setStoryStep(idx)}
                              aria-label={`Bagian ${idx + 1}`}
                              className={`h-1.5 cursor-pointer transition-all ${
                                idx === safeStoryIndex
                                  ? "w-7 bg-[#f5d99e]"
                                  : "w-2.5 bg-white/20 hover:bg-white/40"
                              }`}
                            />
                          ))}
                          <span className="ml-2 font-mono text-[10px] tracking-[0.18em] text-stone-400">
                            {safeStoryIndex + 1} / {totalSegments}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            disabled={safeStoryIndex === 0}
                            onClick={() => {
                              playCinematicSfx("hover");
                              setStoryStep((prev) => Math.max(0, prev - 1));
                            }}
                            aria-label="Paragraf sebelumnya"
                            className="cursor-pointer border border-white/15 p-1.5 text-stone-300 transition-colors hover:border-[#e0be7b] hover:text-white disabled:opacity-30"
                          >
                            <ChevronLeft size={14} />
                          </button>
                          <button
                            type="button"
                            disabled={safeStoryIndex === totalSegments - 1}
                            onClick={() => {
                              playCinematicSfx("hover");
                              setStoryStep((prev) =>
                                Math.min(totalSegments - 1, prev + 1),
                              );
                            }}
                            aria-label="Paragraf berikutnya"
                            className="cursor-pointer border border-white/15 p-1.5 text-stone-300 transition-colors hover:border-[#e0be7b] hover:text-white disabled:opacity-30"
                          >
                            <ChevronRight size={14} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Hikmah Callout */}
                  <div className="border-l-2 border-[#e0be7b] bg-[#e0be7b]/5 py-3 pl-4 pr-3">
                    <div className="flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-[#f5d99e]">
                      <Lightbulb size={12} className="text-[#e0be7b]" />
                      <span>Hikmah</span>
                    </div>
                    <p className="mt-1.5 font-narrative text-sm italic leading-relaxed text-stone-200">
                      “{activeLocation.wisdom}”
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 2: TEMUAN KUNCI */}
              {dossierTab === "discoveries" && (
                <ul className="mt-6 space-y-3">
                  {activeLocation.discoveries.map((discovery, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 border border-white/10 bg-[#070908] p-3.5"
                    >
                      <span className="mt-0.5 font-mono text-xs font-semibold text-[#e0be7b]">
                        0{index + 1}.
                      </span>
                      <span className="font-narrative text-sm leading-relaxed text-stone-200">
                        {discovery}
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              {/* Footer Navigation */}
              <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-5">
                <button
                  type="button"
                  onClick={handlePrevious}
                  disabled={currentIndex === 0}
                  className="inline-flex cursor-pointer items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-stone-400 transition-colors hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <ArrowLeft size={14} />
                  <span>Sebelumnya</span>
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  disabled={currentIndex === chapter01.locations.length - 1}
                  className="inline-flex cursor-pointer items-center gap-2 bg-[#e0be7b] px-5 py-2.5 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-[#070908] transition-colors hover:bg-[#f5d99e] disabled:cursor-not-allowed disabled:opacity-35"
                >
                  <span>Lokasi Berikutnya</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </article>
          </section>

          {/* =========================================================
              INTERACTIVE SCENE: LEMBAH BAKKAH
          ========================================================= */}
          {activeLocation.id === "valley-of-bakkah" && (
            <section className="mt-14 border-t border-white/10 pt-12">
              <div className="mb-6 flex items-center gap-2">
                <Sparkles size={15} className="text-[#e0be7b]" />
                <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-[#f5d99e]">
                  OBSERVASI INTERAKTIF · LEMBAH BAKKAH
                </span>
              </div>

              <InteractiveScene
                title="Menelusuri Lembah Bakkah"
                objects={bakkahObjects}
                chapterId="chapter-01"
                locationId="valley-of-bakkah"
              />
            </section>
          )}

          {/* =========================================================
              FINAL INVESTIGATION CHALLENGE
          ========================================================= */}
          {activeLocation.id === "the-first-foundations" && (
            <section className="mt-14 border-t border-white/10 pt-12">
              <div className="mb-8">
                <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.26em] text-[#f5d99e]">
                  TAHAP AKHIR CHAPTER
                </span>
                <h2 className="mt-2 font-display text-3xl text-white">
                  Waktunya Menyelidiki
                </h2>
                <p className="mt-2 max-w-2xl font-narrative text-base text-stone-300">
                  Gunakan pengetahuan dan bukti yang telah kamu temukan di
                  sepanjang perjalanan untuk menyelesaikan misteri sejarah ini.
                </p>
              </div>

              <InvestigationChallengeExperience
                challenge={chapter01Challenge}
                onComplete={() => {
                  if (!isChapterCompleted) {
                    completeChapter("chapter-01");
                    setIsChapterCompleted(true);
                  }
                }}
              />
            </section>
          )}
        </Container>
      </div>

      {/* Popup Sumber Riwayat & Catatan Ulama */}
      <SourceReferenceModal
        isOpen={isSourceModalOpen}
        onClose={() => setIsSourceModalOpen(false)}
        locationTitle={activeLocation.title}
        locationNumber={activeLocation.number}
        sources={activeLocation.sources}
      />
    </main>
  );
}
