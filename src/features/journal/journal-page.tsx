"use client";

import { useState } from "react";
import { BookOpen, Compass, Feather } from "lucide-react";
import { Container } from "@/components/ui/container";
import { getJournalEntries } from "@/features/journal/journal-service";
import type { JournalCategory, JournalEntry } from "./types";
import { ReflectionForm } from "./reflection-form";

const categories: { id: JournalCategory; label: string }[] = [
  { id: "discoveries", label: "Penemuan" },
  { id: "historical-figures", label: "Tokoh Sejarah" },
  { id: "timeline", label: "Linimasa" },
  { id: "knowledge", label: "Pengetahuan" },
  { id: "clues", label: "Petunjuk" },
  { id: "reflections", label: "Refleksi" },
];

export function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>(() =>
    getJournalEntries(),
  );
  const [activeCategory, setActiveCategory] = useState<JournalCategory | "all">(
    "all",
  );
  const filteredEntries =
    activeCategory === "all"
      ? entries
      : entries.filter((entry) => entry.category === activeCategory);

  function handleReflectionSaved() {
    setEntries(getJournalEntries());
  }

  return (
    <main className="min-h-screen bg-background py-24">
      <Container>
        <header className="mb-12">
          <div className="mb-5 flex items-center gap-3">
            <BookOpen size={18} className="text-accent" />
            <span className="text-xs uppercase tracking-[0.3em] text-accent">
              Explorer Journal
            </span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl">
            Jurnal Perjalanan
          </h1>

          <p className="mt-5 max-w-2xl text-sm leading-8 text-muted">
            Setiap penemuan meninggalkan jejak. Kumpulkan pengetahuan, petunjuk,
            dan refleksi sepanjang perjalananmu menelusuri sejarah.
          </p>
        </header>

        <div className="mb-8 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory("all")}
            className={`border px-4 py-2 text-xs transition-colors ${
              activeCategory === "all"
                ? "border-accent bg-accent text-background"
                : "border-border text-muted hover:text-foreground"
            }`}
          >
            Semua ({entries.length})
          </button>

          {categories.map((category) => {
            const count = entries.filter(
              (entry) => entry.category === category.id,
            ).length;

            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`border px-4 py-2 text-xs transition-colors ${
                  activeCategory === category.id
                    ? "border-accent bg-accent text-background"
                    : "border-border text-muted hover:text-foreground"
                }`}
              >
                {category.label} ({count})
              </button>
            );
          })}
        </div>

        {filteredEntries.length === 0 ? (
          <div className="border border-border px-6 py-20 text-center">
            <Compass size={32} className="mx-auto text-accent" />

            <h2 className="mt-6 font-display text-2xl">Belum Ada Catatan</h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-muted">
              Perjalanan pengetahuanmu baru saja dimulai. Jelajahi lokasi,
              temukan petunjuk, dan semua penemuanmu akan tercatat di sini.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredEntries.map((entry) => (
              <article
                key={entry.id}
                className="border border-border p-6 sm:p-8"
              >
                <div className="mb-4 flex flex-wrap items-center gap-3">
                  {entry.source === "exploration" ? (
                    <Compass size={15} className="text-accent" />
                  ) : (
                    <Feather size={15} className="text-accent" />
                  )}

                  <span className="text-xs uppercase tracking-[0.2em] text-accent">
                    {categories.find(
                      (category) => category.id === entry.category,
                    )?.label ?? entry.category}
                  </span>

                  <span className="text-xs text-muted">
                    {entry.source === "exploration"
                      ? "Discovery"
                      : "Catatan Pribadi"}
                  </span>
                </div>

                <h2 className="font-display text-xl sm:text-2xl">
                  {entry.title}
                </h2>

                <p className="mt-4 text-sm leading-8 text-muted">
                  {entry.content}
                </p>

                <p className="mt-6 text-xs text-muted">
                  {new Date(entry.createdAt).toLocaleString("id-ID", {
                    dateStyle: "long",
                    timeStyle: "short",
                  })}
                </p>
              </article>
            ))}
          </div>
        )}
        <div className="mt-16">
          <ReflectionForm onSaved={handleReflectionSaved} />
        </div>
      </Container>
    </main>
  );
}
