"use client";

import { useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  Compass,
  Feather,
  History,
  Lock,
  MapPin,
  ScrollText,
  Shield,
  Sparkles,
  Swords,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import {
  AmbientSoundToggle,
  playCinematicSfx,
} from "@/components/shared/ambient-sound-toggle";
import { SeamlessLoopVideo } from "@/components/shared/seamless-loop-video";
import type { ExplorerProgress } from "@/features/explorer/progression-types";
import { subscribeToProgress } from "@/features/explorer/progression-service";
import { TheCenterLogo } from "@/components/shared/the-center-logo";

type ExplorerProfile = {
  displayName: string;
  username: string;
  bio?: string;
  motivation?: string;
  curiosity?: string;
  intention?: string;
  createdAt?: string;
};

const PROFILE_STORAGE_KEY = "the-center-explorer-profile";
const PROGRESS_STORAGE_KEY = "the-center-explorer-progress";
const XP_PER_LEVEL = 100;

function renderRelicIcon(iconKey: string) {
  switch (iconKey) {
    case "compass":
      return <Compass size={17} className="text-[#f5d99e]" />;
    case "scroll":
      return <ScrollText size={17} className="text-[#f5d99e]" />;
    case "shield":
      return <Shield size={17} className="text-[#f5d99e]" />;
    default:
      return <span className="text-sm text-[#f5d99e]">{iconKey || "◆"}</span>;
  }
}

function subscribeToProfile(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getStoredProfile() {
  try {
    return localStorage.getItem(PROFILE_STORAGE_KEY);
  } catch {
    return null;
  }
}

function getServerProfile() {
  return null;
}

function getStoredProgress() {
  try {
    return localStorage.getItem(PROGRESS_STORAGE_KEY);
  } catch {
    return null;
  }
}

function getServerProgress() {
  return null;
}

function HudCornerTicks({ active = false }: { active?: boolean }) {
  const tone = active
    ? "border-[#f5d99e]"
    : "border-[#e0be7b]/50 group-hover:border-[#f5d99e]";

  return (
    <>
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute -left-px -top-px z-20 h-2.5 w-2.5 border-l-2 border-t-2 transition-colors duration-300 ${tone}`}
      />
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute -right-px -top-px z-20 h-2.5 w-2.5 border-r-2 border-t-2 transition-colors duration-300 ${tone}`}
      />
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute -bottom-px -left-px z-20 h-2.5 w-2.5 border-b-2 border-l-2 transition-colors duration-300 ${tone}`}
      />
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute -bottom-px -right-px z-20 h-2.5 w-2.5 border-b-2 border-r-2 transition-colors duration-300 ${tone}`}
      />
    </>
  );
}

export function ExplorerHub() {
  const [dossierTab, setDossierTab] = useState<"oath" | "log">("oath");

  const savedProgress = useSyncExternalStore(
    subscribeToProgress,
    getStoredProgress,
    getServerProgress,
  );

  let progress: ExplorerProgress = {
    totalXP: 0,
    completedChapters: [],
    badges: [],
    activities: [],
  };

  try {
    if (savedProgress) {
      progress = JSON.parse(savedProgress);
    }
  } catch {
    // Abaikan data progress tidak valid
  }

  const savedProfile = useSyncExternalStore(
    subscribeToProfile,
    getStoredProfile,
    getServerProfile,
  );

  let profile: ExplorerProfile | null = null;

  try {
    profile = savedProfile ? JSON.parse(savedProfile) : null;
  } catch {
    // Abaikan data profil tidak valid
  }

  const isChapterCompleted = progress.completedChapters.includes("chapter-01");
  const currentLevel = Math.floor(progress.totalXP / XP_PER_LEVEL) + 1;
  const formattedLevel = String(currentLevel).padStart(2, "0");
  const currentLevelXP = progress.totalXP % XP_PER_LEVEL;
  const levelProgressPercent = Math.min(
    100,
    Math.round((currentLevelXP / XP_PER_LEVEL) * 100),
  );

  const lockedSlotCount = Math.max(0, 4 - progress.badges.length);

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#060807] text-[#f7f3ea] selection:bg-[#e0be7b]/30 selection:text-white">
      {/* =========================================================
          AMBIENT WORLD BACKDROP
      ========================================================= */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <Image
          src="/images/prologue/scene-6.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="scale-105 object-cover object-center opacity-15 blur-[3px]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_25%_20%,rgba(224,190,123,0.12),transparent_50%),radial-gradient(ellipse_at_80%_75%,rgba(199,166,106,0.08),transparent_55%),linear-gradient(to_bottom,rgba(6,8,7,0.85),#060807)]"
        />
        {/* Garis Grid Teknis Tipis ala HUD */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[64px_64px]"
        />
      </div>

      {/* =========================================================
          TOP GAME HUD BAR
      ========================================================= */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#060807]/85 backdrop-blur-md">
        <Container>
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Brand & Breadcrumb */}
            <div className="flex items-center gap-3">
              <TheCenterLogo size="md" />

              <span className="hidden text-white/20 md:inline">/</span>
              <span className="hidden font-mono text-[10px] uppercase tracking-[0.28em] text-[#e0be7b] md:inline">
                COMMAND SANCTUARY
              </span>
            </div>

            {/* Center Quick Nav */}
            <nav className="hidden items-center gap-6 lg:flex">
              <Link
                href="/prologue"
                onMouseEnter={() => playCinematicSfx("hover")}
                className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.24em] text-stone-400 transition-colors hover:text-[#f5d99e]"
              >
                <History size={12} className="text-[#e0be7b]" />
                <span>Replay Prologue</span>
              </Link>
              <Link
                href="/journal"
                onMouseEnter={() => playCinematicSfx("hover")}
                className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.24em] text-stone-400 transition-colors hover:text-[#f5d99e]"
              >
                <BookOpen size={12} className="text-[#e0be7b]" />
                <span>Chronicle Journal</span>
              </Link>
            </nav>

            {/* Right Status & Audio */}
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="hidden items-center gap-2 border border-[#e0be7b]/30 bg-[#e0be7b]/10 px-3 py-1 sm:flex">
                <span className="font-mono text-[10px] font-semibold tracking-[0.18em] text-[#f5d99e]">
                  LV.{formattedLevel}
                </span>
                <span className="text-white/20">|</span>
                <span className="font-mono text-[10px] tracking-[0.14em] text-stone-200">
                  {progress.totalXP} XP
                </span>
              </div>

              <AmbientSoundToggle
                audioSrc="/audio/main-theme-the-discovery.mp3"
                activeTrack={1}
                volume={0.13}
              />
            </div>
          </div>
        </Container>
      </header>

      {/* =========================================================
          MAIN RPG COMMAND LOBBY (12-COLUMN ASYMMETRIC GRID)
      ========================================================= */}
      <div className="relative z-10 py-8 sm:py-12">
        <Container>
          <div className="grid gap-6 lg:grid-cols-12 lg:items-start">
            {/* =====================================================
                LEFT COLUMN (4 COLS): CHARACTER DOSSIER & LIVE PORTRAIT
            ===================================================== */}
            <aside className="relative border border-white/15 bg-[#0b0e0c]/85 backdrop-blur-md lg:col-span-4">
              <HudCornerTicks active />

              {/* Portrait Frame dengan Live Loop Video */}
              <div className="relative h-64 w-full overflow-hidden border-b border-white/10 sm:h-72">
                <SeamlessLoopVideo
                  src="/videos/explorer/register-loop.mp4"
                  poster="/images/explorer/register.webp"
                  crossfadeSec={0.8}
                  className="scale-110 object-cover object-[50%_38%]"
                />

                {/* Vignette Gradient agar teks di atas portrait tajam */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 z-10 bg-linear-to-t from-[#0b0e0c] via-[#0b0e0c]/25 to-black/35"
                />

                {/* Top Badges di dalam Portrait */}
                <div className="absolute inset-x-4 top-4 z-20 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 border border-[#e0be7b]/50 bg-[#070908]/75 px-2.5 py-1 font-mono text-[9px] font-semibold uppercase tracking-[0.24em] text-[#f5d99e] backdrop-blur-xs">
                    <Shield size={10} className="text-[#e0be7b]" />
                    RANK I · EXPLORER
                  </span>

                  {/* Diamond Level Badge */}
                  <div className="flex h-10 w-10 rotate-45 items-center justify-center border border-[#f5d99e]/80 bg-[#070908]/85 shadow-[0_0_20px_rgba(224,190,123,0.35)]">
                    <div className="-rotate-45 text-center leading-none">
                      <span className="block font-mono text-[7px] uppercase tracking-widest text-[#e0be7b]">
                        LV
                      </span>
                      <span className="font-display text-sm font-semibold text-white">
                        {formattedLevel}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Nama & Username di Bawah Portrait */}
                <div className="absolute inset-x-5 bottom-4 z-20">
                  <p className="font-mono text-[11px] tracking-[0.16em] text-[#e0be7b]">
                    @{profile?.username || "explorer"}
                  </p>
                  <h1 className="mt-1 font-display text-2xl tracking-[0.04em] text-white sm:text-3xl">
                    {profile?.displayName || "Explorer"}
                  </h1>
                </div>
              </div>

              {/* Body Dossier: XP Gauge, Bio & Oath/Log Switcher */}
              <div className="p-5 sm:p-6">
                {/* XP Progress Bar */}
                <div>
                  <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em]">
                    <span className="text-stone-400">Chronicle Resonance</span>
                    <span className="text-[#f5d99e]">
                      {currentLevelXP} / {XP_PER_LEVEL} XP
                    </span>
                  </div>
                  <div className="relative mt-2 h-1.5 w-full bg-white/10">
                    <div
                      style={{ width: `${levelProgressPercent}%` }}
                      className="h-full bg-linear-to-r from-[#c7a66a] to-[#f5d99e] shadow-[0_0_12px_rgba(245,217,158,0.7)] transition-all duration-500"
                    />
                  </div>
                </div>

                {/* Bio / Kutipan Identitas */}
                <p className="mt-5 border-l-2 border-[#e0be7b]/45 pl-3.5 font-narrative text-sm italic leading-relaxed text-stone-300">
                  {profile?.bio
                    ? `“${profile.bio}”`
                    : "“Melangkah menembus lorong waktu untuk memahami akar sejarah dan menemukan peran di masa kini.”"}
                </p>

                {/* Mini Stat Row */}
                <div className="mt-5 grid grid-cols-3 divide-x divide-white/10 border border-white/10 bg-[#070908]/70 py-3 text-center">
                  <div>
                    <span className="block font-mono text-[9px] uppercase tracking-[0.2em] text-stone-400">
                      Total XP
                    </span>
                    <span className="mt-1 block font-display text-lg text-white">
                      {progress.totalXP}
                    </span>
                  </div>
                  <div>
                    <span className="block font-mono text-[9px] uppercase tracking-[0.2em] text-stone-400">
                      Chapters
                    </span>
                    <span className="mt-1 block font-display text-lg text-[#f5d99e]">
                      {progress.completedChapters.length}/03
                    </span>
                  </div>
                  <div>
                    <span className="block font-mono text-[9px] uppercase tracking-[0.2em] text-stone-400">
                      Relics
                    </span>
                    <span className="mt-1 block font-display text-lg text-white">
                      {progress.badges.length}
                    </span>
                  </div>
                </div>

                {/* Switcher Tab: Catatan Niat Awal vs Log Aktivitas */}
                <div className="mt-6">
                  <div className="grid grid-cols-2 border border-white/10 bg-[#070908]/60 p-1 font-mono text-[10px] uppercase tracking-[0.2em]">
                    <button
                      type="button"
                      onClick={() => {
                        playCinematicSfx("hover");
                        setDossierTab("oath");
                      }}
                      className={`cursor-pointer py-2 transition-colors ${
                        dossierTab === "oath"
                          ? "bg-[#e0be7b]/20 text-[#f5d99e]"
                          : "text-stone-400 hover:text-stone-200"
                      }`}
                    >
                      Komitmen Awal
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        playCinematicSfx("hover");
                        setDossierTab("log");
                      }}
                      className={`cursor-pointer py-2 transition-colors ${
                        dossierTab === "log"
                          ? "bg-[#e0be7b]/20 text-[#f5d99e]"
                          : "text-stone-400 hover:text-stone-200"
                      }`}
                    >
                      Log Jejak ({progress.activities.length})
                    </button>
                  </div>

                  {dossierTab === "oath" ? (
                    <div className="mt-3 space-y-2.5">
                      {profile?.motivation ||
                      profile?.curiosity ||
                      profile?.intention ? (
                        <>
                          {profile?.motivation && (
                            <div className="border border-white/8 bg-[#070908]/55 p-3">
                              <span className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.22em] text-[#e0be7b]">
                                <Feather size={10} /> Dorongan Awal
                              </span>
                              <p className="mt-1.5 font-narrative text-xs leading-relaxed text-stone-300">
                                “{profile.motivation}”
                              </p>
                            </div>
                          )}
                          {profile?.curiosity && (
                            <div className="border border-white/8 bg-[#070908]/55 p-3">
                              <span className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.22em] text-[#e0be7b]">
                                <Compass size={10} /> Pencarian Masa Lalu
                              </span>
                              <p className="mt-1.5 font-narrative text-xs leading-relaxed text-stone-300">
                                “{profile.curiosity}”
                              </p>
                            </div>
                          )}
                          {profile?.intention && (
                            <div className="border border-white/8 bg-[#070908]/55 p-3">
                              <span className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.22em] text-[#e0be7b]">
                                <Sparkles size={10} /> Kontribusi Masa Kini
                              </span>
                              <p className="mt-1.5 font-narrative text-xs leading-relaxed text-stone-300">
                                “{profile.intention}”
                              </p>
                            </div>
                          )}
                        </>
                      ) : (
                        <p className="border border-dashed border-white/10 p-3.5 text-xs leading-relaxed text-stone-400">
                          Catatan refleksi awal belum tersimpan. Mulailah
                          menjelajah untuk mencatat perjalananmu di Jurnal.
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="mt-3 space-y-2">
                      {progress.activities.length > 0 ? (
                        progress.activities.slice(0, 4).map((act) => (
                          <div
                            key={act.id}
                            className="flex items-start justify-between gap-3 border border-white/8 bg-[#070908]/55 p-3"
                          >
                            <div className="min-w-0">
                              <p className="truncate font-medium text-xs text-stone-100">
                                {act.activity}
                              </p>
                              {act.description && (
                                <p className="mt-0.5 line-clamp-1 text-[11px] text-stone-400">
                                  {act.description}
                                </p>
                              )}
                            </div>

                            <span className="shrink-0 border border-[#e0be7b]/30 bg-[#e0be7b]/10 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-[#f5d99e]">
                              +{act.points} XP
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="border border-dashed border-white/10 p-3.5 text-xs leading-relaxed text-stone-400">
                          Belum ada catatan aktivitas. Selesaikan Chapter 01
                          untuk mencatat jejak pertamamu.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </aside>

            {/* =====================================================
                RIGHT COLUMN (8 COLS): MAIN QUEST STAGE & INVENTORY
            ===================================================== */}
            <div className="flex flex-col gap-6 lg:col-span-8">
              {/* ---------------------------------------------------
                  1. MAIN STORY QUEST STAGE (CHAPTER 01)
              --------------------------------------------------- */}
              <section className="group relative overflow-hidden border border-[#e0be7b]/45 bg-[#0b0e0c]/90 backdrop-blur-md transition-all duration-500 hover:border-[#f5d99e]/80 hover:shadow-[0_0_50px_-15px_rgba(224,190,123,0.3)]">
                <HudCornerTicks active />

                {/* Artwork Latar Belakang Misi */}
                <div className="pointer-events-none absolute inset-0">
                  <Image
                    src="/images/prologue/scene-6.webp"
                    alt="Chapter 01 — The First Foundations"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 66vw"
                    className="object-cover object-[70%_45%] opacity-45 transition-transform duration-1000 ease-out group-hover:scale-105"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-linear-to-r from-[#080a09] via-[#080a09]/88 to-[#080a09]/25"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-linear-to-t from-[#080a09] via-transparent to-[#080a09]/50"
                  />
                </div>

                <div className="relative z-10 p-6 sm:p-10">
                  {/* Quest Header Tags */}
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="inline-flex items-center gap-1.5 bg-[#e0be7b] px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-[#070908]">
                        <Swords size={11} />
                        MAIN QUEST · CH. 01
                      </span>

                      {isChapterCompleted ? (
                        <span className="inline-flex items-center gap-1.5 border border-emerald-400/50 bg-emerald-500/15 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-emerald-300">
                          <CheckCircle2 size={11} />
                          COMPLETED
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 border border-[#e0be7b]/45 bg-[#070908]/75 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-[#f5d99e]">
                          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#f5d99e]" />
                          READY TO EMBARK
                        </span>
                      )}
                    </div>

                    <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-stone-300">
                      <MapPin size={12} className="text-[#e0be7b]" />
                      VALLEY OF BAKKAH &amp; AL-QUDS
                    </span>
                  </div>

                  {/* Quest Title & Lore */}
                  <div className="mt-6 max-w-xl">
                    <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#e0be7b]">
                      ERA 01 · PRIMORDIAL FOUNDATIONS
                    </span>

                    <h2 className="mt-2 font-display text-3xl tracking-[0.04em] text-white sm:text-5xl">
                      The First Foundations
                    </h2>

                    <p className="mt-4 font-narrative text-base leading-[1.8] text-stone-200 sm:text-lg">
                      Menelusuri jejak awal dua tempat suci yang memiliki
                      kedudukan penting dalam sejarah manusia: Masjidil Haram
                      dan Masjidil Aqsa.
                    </p>
                  </div>

                  {/* Quest Action & Reward Strip */}
                  <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6">
                    <Link
                      href="/chapters/01"
                      onClick={() => playCinematicSfx("portal")}
                      onMouseEnter={() => playCinematicSfx("hover")}
                      className="inline-flex items-center gap-3 border border-[#f5d99e] bg-[#e0be7b] px-7 py-3.5 font-mono text-xs font-bold uppercase tracking-[0.24em] text-[#070908] shadow-[0_0_28px_rgba(224,190,123,0.3)] transition-all duration-300 hover:bg-[#f5d99e] hover:shadow-[0_0_36px_rgba(245,217,158,0.55)]"
                    >
                      <span>
                        {isChapterCompleted
                          ? "Jelajahi Kembali Chapter"
                          : "Mulai Chapter 01"}
                      </span>
                      <ArrowRight size={15} />
                    </Link>

                    <div className="flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.2em] text-stone-300">
                      <span className="border border-white/15 bg-[#070908]/75 px-3 py-1.5 text-[#f5d99e]">
                        REWARD: +100 XP &amp; RELIC
                      </span>
                    </div>
                  </div>
                </div>

                {/* Campaign Timeline Strip (Chapter 01 -> 02 -> 03) */}
                <div className="relative z-10 grid grid-cols-3 divide-x divide-white/10 border-t border-white/10 bg-[#060807]/90">
                  <div className="flex items-center gap-2.5 px-4 py-3">
                    <span className="h-2 w-2 rotate-45 bg-[#f5d99e]" />
                    <div className="min-w-0">
                      <span className="block font-mono text-[9px] uppercase tracking-[0.2em] text-[#f5d99e]">
                        CH. 01 · ACTIVE
                      </span>
                      <span className="block truncate text-xs text-white">
                        First Foundations
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 px-4 py-3 opacity-55">
                    <Lock size={11} className="shrink-0 text-stone-400" />
                    <div className="min-w-0">
                      <span className="block font-mono text-[9px] uppercase tracking-[0.2em] text-stone-400">
                        CH. 02 · SEALED
                      </span>
                      <span className="block truncate text-xs text-stone-300">
                        Available Soon
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 px-4 py-3 opacity-45">
                    <Lock size={11} className="shrink-0 text-stone-500" />
                    <div className="min-w-0">
                      <span className="block font-mono text-[9px] uppercase tracking-[0.2em] text-stone-500">
                        CH. 03 · SEALED
                      </span>
                      <span className="block truncate text-xs text-stone-400">
                        Sacred Legacy
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              {/* ---------------------------------------------------
                  2. BOTTOM SPLIT: CHRONICLE JOURNAL & RELIC SLOTS
              --------------------------------------------------- */}
              <div className="grid gap-6 md:grid-cols-12">
                {/* Jurnal Perjalanan (5 Cols) */}
                <Link
                  href="/journal"
                  onMouseEnter={() => playCinematicSfx("hover")}
                  className="group relative flex flex-col justify-between border border-white/15 bg-[#0b0e0c]/85 p-6 backdrop-blur-md transition-all duration-300 hover:border-[#e0be7b]/70 hover:bg-[#0e120f] md:col-span-5"
                >
                  <HudCornerTicks />

                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex h-10 w-10 items-center justify-center border border-[#e0be7b]/40 bg-[#e0be7b]/10 text-[#e0be7b] transition-colors group-hover:border-[#f5d99e] group-hover:text-[#f5d99e]">
                        <BookOpen size={18} />
                      </div>
                      <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-stone-400 transition-colors group-hover:text-[#f5d99e]">
                        CODEX →
                      </span>
                    </div>

                    <h3 className="mt-5 font-display text-2xl text-white transition-colors group-hover:text-[#f5d99e]">
                      Jurnal Perjalanan
                    </h3>

                    <p className="mt-2.5 font-narrative text-sm leading-[1.75] text-stone-300">
                      Lihat seluruh penemuan, petunjuk sejarah, dan refleksi
                      yang telah kamu kumpulkan.
                    </p>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 font-mono text-[10px] uppercase tracking-[0.24em] text-[#e0be7b]">
                    <span>Buka Arsip Jurnal</span>
                    <ArrowRight
                      size={13}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </div>
                </Link>

                {/* Pencapaian / Relic Slots (7 Cols) */}
                <section className="group relative flex flex-col justify-between border border-white/15 bg-[#0b0e0c]/85 p-6 backdrop-blur-md md:col-span-7">
                  <HudCornerTicks />

                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center border border-[#e0be7b]/40 bg-[#e0be7b]/10 text-[#e0be7b]">
                          <Award size={18} />
                        </div>
                        <div>
                          <span className="block font-mono text-[9px] uppercase tracking-[0.24em] text-[#e0be7b]">
                            EXPLORER RELICS
                          </span>
                          <h3 className="font-display text-xl text-white">
                            Pencapaianmu
                          </h3>
                        </div>
                      </div>

                      <span className="border border-white/10 bg-[#070908]/80 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-stone-300">
                        {progress.badges.length} / 4 RELICS
                      </span>
                    </div>

                    {/* Grid Slot Relic RPG */}
                    <div className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                      {progress.badges.map((badge) => (
                        <div
                          key={badge.id}
                          className="flex items-start gap-3 border border-[#e0be7b]/40 bg-[#e0be7b]/10 p-3"
                        >
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-[#f5d99e]/50 bg-[#070908]/80 text-lg">
                            {renderRelicIcon(badge.icon)}
                          </span>
                          <div className="min-w-0">
                            <h4 className="truncate font-display text-sm text-[#f5d99e]">
                              {badge.title}
                            </h4>
                            <p className="mt-0.5 line-clamp-2 text-[11px] leading-relaxed text-stone-300">
                              {badge.description}
                            </p>
                          </div>
                        </div>
                      ))}

                      {Array.from({ length: lockedSlotCount }).map((_, idx) => (
                        <div
                          key={`locked-slot-${idx}`}
                          className="flex items-center gap-3 border border-dashed border-white/12 bg-[#070908]/50 p-3 opacity-65"
                        >
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-white/10 bg-white/2 text-stone-500">
                            <Lock size={13} />
                          </span>
                          <div>
                            <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-stone-400">
                              Relic Terkunci
                            </span>
                            <span className="block text-[11px] text-stone-500">
                              Selesaikan chapter
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <p className="mt-4 flex items-center gap-2 border-t border-white/10 pt-3.5 font-mono text-[10px] uppercase tracking-[0.2em] text-stone-400">
                    <ScrollText size={12} className="text-[#e0be7b]" />
                    <span>Perjalananmu baru saja dimulai.</span>
                  </p>
                </section>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </main>
  );
}
