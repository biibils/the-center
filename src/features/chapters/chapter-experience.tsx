"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, BookOpen, Compass } from "lucide-react";
import { Container } from "@/components/ui/container";
import { WorldMap } from "@/features/chapters/world-map";
import { chapter01 } from "@/content/chapters/chapter-01";
import {
  InteractiveScene,
  type SceneObject,
} from "@/features/exploration/interactive-scene";
import { InvestigationChallengeExperience } from "@/features/challenges/investigation-challenge";
import { chapter01Challenge } from "@/content/chapters/chapter-01-challenge";
import { completeChapter } from "@/features/explorer/progression-service";
import { getExplorerProgress } from "@/features/explorer/progression-service";

export function ChapterExperience() {
  const [activeLocationId, setActiveLocationId] = useState(
    chapter01.locations[0].id,
  );
  const [isChapterCompleted] = useState(() =>
    getExplorerProgress().completedChapters.includes("chapter-01"),
  );

  const activeLocation = chapter01.locations.find(
    (location) => location.id === activeLocationId,
  )!;

  const currentIndex = chapter01.locations.findIndex(
    (location) => location.id === activeLocationId,
  );

  const bakkahObjects: SceneObject[] = [
    {
      id: "quran-verse",
      label: "Petunjuk dari Al-Qur'an",
      description:
        "QS. Ali 'Imran ayat 96 menyebut Bakkah sebagai lokasi rumah ibadah pertama yang diperuntukkan bagi manusia, serta tempat yang diberkahi dan menjadi petunjuk bagi seluruh alam.",
      position: { x: 50, y: 35 },
    },
    {
      id: "sacred-valley",
      label: "Lembah yang Diberkahi",
      description:
        "Bakkah disebut secara khusus dalam Al-Qur'an. Nama ini menjadi salah satu petunjuk penting dalam menelusuri sejarah Masjidil Haram.",
      position: { x: 25, y: 65 },
    },
    {
      id: "historical-question",
      label: "Jejak Sejarah",
      description:
        "Kapan dan bagaimana tempat suci ini pertama kali dibangun? Pertanyaan tersebut akan menjadi bagian dari penyelidikan kita sepanjang chapter ini.",
      position: { x: 75, y: 60 },
    },
  ];

  function handleNext() {
    if (currentIndex < chapter01.locations.length - 1) {
      setActiveLocationId(chapter01.locations[currentIndex + 1].id);
    }
  }

  function handlePrevious() {
    if (currentIndex > 0) {
      setActiveLocationId(chapter01.locations[currentIndex - 1].id);
    }
  }

  return (
    <main className="min-h-screen bg-background py-24">
      <Container>
        <header className="mb-12">
          <div className="mb-6 flex items-center gap-3">
            <span className="text-xs uppercase tracking-[0.3em] text-accent">
              Chapter {chapter01.number}
            </span>
            <span className="h-px w-10 bg-border" />
            <span className="text-xs text-muted">Historical Exploration</span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl">
            {chapter01.title}
          </h1>

          <h2 className="mt-3 font-display text-xl italic text-accent">
            {chapter01.subtitle}
          </h2>

          <p className="mt-6 max-w-2xl text-sm leading-8 text-muted">
            {chapter01.description}
          </p>
        </header>

        <section className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <Compass size={18} className="text-accent" />
              <h2 className="font-display text-xl">Peta Perjalanan</h2>
            </div>

            <WorldMap
              locations={chapter01.locations}
              activeLocationId={activeLocationId}
              onSelectLocation={setActiveLocationId}
            />
          </div>

          <article className="flex flex-col border border-border p-7 sm:p-8">
            <div className="mb-8">
              <span className="text-xs uppercase tracking-[0.25em] text-accent">
                Lokasi {activeLocation.number}
              </span>

              <h2 className="mt-4 font-display text-3xl">
                {activeLocation.title}
              </h2>

              <p className="mt-2 font-display text-base italic text-muted">
                {activeLocation.subtitle}
              </p>
            </div>

            <p className="text-sm leading-8 text-muted">
              {activeLocation.description}
            </p>

            <div className="my-8 border-t border-border" />

            <div>
              <div className="mb-5 flex items-center gap-3">
                <BookOpen size={17} className="text-accent" />
                <h3 className="font-display text-xl">Konteks Sejarah</h3>
              </div>

              <div className="space-y-5">
                {activeLocation.historicalContext.map((paragraph, index) => (
                  <p key={index} className="text-sm leading-8 text-muted">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            <div className="my-8 border-t border-border" />

            <div>
              <h3 className="font-display text-xl">Hal yang Perlu Ditemukan</h3>

              <ul className="mt-5 space-y-4">
                {activeLocation.discoveries.map((discovery, index) => (
                  <li
                    key={index}
                    className="flex gap-3 text-sm leading-7 text-muted"
                  >
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    {discovery}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-auto flex items-center justify-between border-t border-border pt-7">
              <button
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground disabled:opacity-30"
              >
                <ArrowLeft size={15} />
                Sebelumnya
              </button>

              <button
                onClick={handleNext}
                disabled={currentIndex === chapter01.locations.length - 1}
                className="inline-flex items-center gap-2 bg-accent px-4 py-3 text-sm font-medium text-background transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40"
              >
                Lokasi Berikutnya
                <ArrowRight size={15} />
              </button>
            </div>
          </article>
        </section>
        {activeLocation.id === "valley-of-bakkah" && (
          <div className="mt-16">
            <InteractiveScene
              title="Menelusuri Lembah Bakkah"
              objects={bakkahObjects}
              chapterId="chapter-01"
              locationId="valley-of-bakkah"
            />
          </div>
        )}
        {activeLocation.id === "the-first-foundations" && (
          <section className="mt-20">
            <div className="mb-8">
              <span className="text-xs uppercase tracking-[0.25em] text-accent">
                Tahap Akhir Chapter
              </span>

              <h2 className="mt-3 font-display text-3xl">
                Waktunya Menyelidiki
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-8 text-muted">
                Gunakan pengetahuan dan bukti yang telah kamu temukan untuk
                menyelesaikan misteri sejarah ini.
              </p>
            </div>

            <InvestigationChallengeExperience
              challenge={chapter01Challenge}
              onComplete={() => {
                if (!isChapterCompleted) {
                  completeChapter("chapter-01");
                }
              }}
            />
          </section>
        )}
      </Container>
    </main>
  );
}
