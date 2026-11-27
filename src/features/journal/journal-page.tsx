"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Compass,
  Feather,
  MapPin,
  Search,
  Trash2,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { TheCenterLogo } from "@/components/shared/the-center-logo";
import {
  AmbientSoundToggle,
  playCinematicSfx,
} from "@/components/shared/ambient-sound-toggle";
import {
  deleteJournalEntry,
  getJournalEntries,
} from "@/features/journal/journal-service";
import type { JournalCategory, JournalEntry } from "./types";
import { ReflectionForm } from "./reflection-form";
import { syncProgressFromCloud } from "../explorer/progression-service";

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
  const [searchQuery, setSearchQuery] = useState("");

  const discoveryCount = entries.filter(
    (entry) => entry.source === "exploration",
  ).length;
  const manualCount = entries.filter(
    (entry) => entry.source === "manual",
  ).length;

  const filteredEntries = entries.filter((entry) => {
    const matchesCategory =
      activeCategory === "all" || entry.category === activeCategory;
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !normalizedQuery ||
      entry.title.toLowerCase().includes(normalizedQuery) ||
      entry.content.toLowerCase().includes(normalizedQuery);

    return matchesCategory && matchesSearch;
  });

  function refreshEntries() {
    setEntries(getJournalEntries());
  }

  function handleDelete(entryId: string) {
    playCinematicSfx("hover");
    deleteJournalEntry(entryId);
    refreshEntries();
  }

  useEffect(() => {
    void syncProgressFromCloud();
  }, []);

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
                CHRONICLE CODEX
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/explorer"
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
          {/* Header & Codex Telemetry */}
          <header className="mb-10 flex flex-col justify-between gap-6 border-b border-white/10 pb-8 lg:flex-row lg:items-end">
            <div>
              <div className="flex items-center gap-2.5">
                <BookOpen size={15} className="text-[#e0be7b]" />
                <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.28em] text-[#e0be7b]">
                  EXPLORER JOURNAL & FIELD ARCHIVE
                </span>
              </div>

              <h1 className="mt-3 font-display text-3xl tracking-[0.02em] text-white sm:text-5xl">
                Jurnal Perjalanan
              </h1>

              <p className="mt-3 max-w-2xl font-narrative text-sm leading-relaxed text-stone-300 sm:text-base">
                Setiap penemuan meninggalkan jejak. Kumpulkan pengetahuan,
                petunjuk sejarah, dan refleksi sepanjang perjalananmu.
              </p>
            </div>

            {/* Compact Telemetry Counters */}
            <div className="grid grid-cols-3 divide-x divide-white/10 border border-white/12 bg-[#0b0e0c]">
              <div className="px-4 py-3 text-center">
                <span className="block font-mono text-[9px] uppercase tracking-[0.2em] text-stone-400">
                  Total Arsip
                </span>
                <span className="mt-1 block font-display text-xl text-white">
                  {entries.length}
                </span>
              </div>
              <div className="px-4 py-3 text-center">
                <span className="block font-mono text-[9px] uppercase tracking-[0.2em] text-stone-400">
                  Penemuan
                </span>
                <span className="mt-1 block font-display text-xl text-[#f5d99e]">
                  {discoveryCount}
                </span>
              </div>
              <div className="px-4 py-3 text-center">
                <span className="block font-mono text-[9px] uppercase tracking-[0.2em] text-stone-400">
                  Refleksi
                </span>
                <span className="mt-1 block font-display text-xl text-white">
                  {manualCount}
                </span>
              </div>
            </div>
          </header>

          {/* =========================================================
              2-COLUMN WORKSPACE: CODEX ENTRIES (LEFT) & SCRIBE DESK (RIGHT)
          ========================================================= */}
          <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
            {/* LEFT (7 COLS): FILTER & ENTRIES */}
            <section className="lg:col-span-7">
              {/* Search Bar */}
              <div className="mb-4 flex h-10 items-center border border-white/12 bg-[#0b0e0c] px-3.5 transition-colors focus-within:border-[#e0be7b]/70">
                <Search size={14} className="mr-3 text-[#e0be7b]/80" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari judul penemuan atau catatan refleksi..."
                  className="w-full bg-transparent text-sm text-white placeholder:text-stone-500 focus:outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="cursor-pointer font-mono text-[10px] uppercase tracking-wider text-stone-400 hover:text-white"
                  >
                    RESET
                  </button>
                )}
              </div>

              {/* Category Filter Bar */}
              <div className="mb-6 flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    playCinematicSfx("hover");
                    setActiveCategory("all");
                  }}
                  className={`cursor-pointer border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors ${
                    activeCategory === "all"
                      ? "border-[#f5d99e] bg-[#e0be7b] font-bold text-[#070908]"
                      : "border-white/12 bg-[#0b0e0c] text-stone-400 hover:border-[#e0be7b]/50 hover:text-white"
                  }`}
                >
                  Semua ({entries.length})
                </button>

                {categories.map((category) => {
                  const count = entries.filter(
                    (entry) => entry.category === category.id,
                  ).length;
                  const active = activeCategory === category.id;

                  return (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => {
                        playCinematicSfx("hover");
                        setActiveCategory(category.id);
                      }}
                      className={`cursor-pointer border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors ${
                        active
                          ? "border-[#f5d99e] bg-[#e0be7b] font-bold text-[#070908]"
                          : "border-white/12 bg-[#0b0e0c] text-stone-400 hover:border-[#e0be7b]/50 hover:text-white"
                      }`}
                    >
                      {category.label} ({count})
                    </button>
                  );
                })}
              </div>

              {/* Entries List or Empty State */}
              {filteredEntries.length === 0 ? (
                <div className="border border-dashed border-white/15 bg-[#0b0e0c]/70 px-6 py-16 text-center">
                  <Compass
                    size={28}
                    className="mx-auto text-[#e0be7b]/80"
                    strokeWidth={1.5}
                  />

                  <h2 className="mt-4 font-display text-2xl text-white">
                    {entries.length === 0
                      ? "Belum Ada Catatan"
                      : "Tidak Ditemukan"}
                  </h2>

                  <p className="mx-auto mt-2.5 max-w-md font-narrative text-sm leading-relaxed text-stone-300">
                    {entries.length === 0
                      ? "Perjalanan pengetahuanmu baru saja dimulai. Jelajahi lokasi di Chapter 01 atau tulis refleksi pertamamu di Meja Penulis."
                      : "Tidak ada catatan yang cocok dengan kata kunci atau kategori yang dipilih."}
                  </p>

                  {entries.length === 0 && (
                    <Link
                      href="/chapters/01"
                      onMouseEnter={() => playCinematicSfx("hover")}
                      className="mt-6 inline-flex items-center gap-2 border border-[#f5d99e] bg-[#e0be7b] px-5 py-2.5 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#070908] transition-colors hover:bg-[#f5d99e]"
                    >
                      <span>Jelajahi Chapter 01</span>
                    </Link>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredEntries.map((entry) => {
                    const isDiscovery = entry.source === "exploration";
                    const categoryLabel =
                      categories.find(
                        (category) => category.id === entry.category,
                      )?.label ?? entry.category;

                    return (
                      <article
                        key={entry.id}
                        className="group relative border border-white/12 bg-[#0b0e0c] p-6 transition-colors hover:border-[#e0be7b]/45"
                      >
                        {/* Left Gold Accent Bar */}
                        <span
                          aria-hidden="true"
                          className={`absolute inset-y-0 left-0 w-0.75 ${
                            isDiscovery ? "bg-[#e0be7b]" : "bg-stone-500"
                          }`}
                        />

                        {/* Entry Meta Header */}
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex flex-wrap items-center gap-2.5">
                            <span
                              className={`inline-flex items-center gap-1.5 border px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-[0.2em] ${
                                isDiscovery
                                  ? "border-[#e0be7b]/40 bg-[#e0be7b]/12 text-[#f5d99e]"
                                  : "border-white/15 bg-white/4 text-stone-300"
                              }`}
                            >
                              {isDiscovery ? (
                                <Compass size={10} />
                              ) : (
                                <Feather size={10} />
                              )}
                              <span>{categoryLabel}</span>
                            </span>

                            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-stone-400">
                              {isDiscovery
                                ? "FIELD DISCOVERY"
                                : "CATATAN PRIBADI"}
                            </span>

                            {entry.chapterId && (
                              <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.16em] text-[#e0be7b]/80">
                                <MapPin size={10} />
                                <span>{entry.chapterId}</span>
                              </span>
                            )}
                          </div>

                          {/* Hapus Catatan Manual */}
                          {!isDiscovery && (
                            <button
                              type="button"
                              onClick={() => handleDelete(entry.id)}
                              aria-label="Hapus catatan"
                              className="cursor-pointer p-1 text-stone-500 opacity-0 transition-all hover:text-rose-400 group-hover:opacity-100"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>

                        {/* Title & Narrative Content */}
                        <h2 className="mt-3.5 font-display text-xl text-white sm:text-2xl">
                          {entry.title}
                        </h2>

                        <p className="mt-3 whitespace-pre-line font-narrative text-sm leading-[1.85] text-stone-200 sm:text-[15px]">
                          {entry.content}
                        </p>

                        {/* Timestamp Footer */}
                        <div className="mt-5 flex items-center justify-between border-t border-white/8 pt-3 font-mono text-[10px] tracking-[0.14em] text-stone-400">
                          <span>
                            {new Date(entry.createdAt).toLocaleString("id-ID", {
                              dateStyle: "long",
                              timeStyle: "short",
                            })}
                          </span>
                          <span>
                            {isDiscovery ? "VERIFIED LOG" : "PERSONAL SCRIBE"}
                          </span>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>

            {/* RIGHT (5 COLS): STICKY SCRIBE'S DESK */}
            <aside className="lg:sticky lg:top-24 lg:col-span-5">
              <ReflectionForm onSaved={refreshEntries} />
            </aside>
          </div>
        </Container>
      </div>
    </main>
  );
}
