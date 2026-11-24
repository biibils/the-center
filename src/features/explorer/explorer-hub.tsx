"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Compass,
  ScrollText,
  Sparkles,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import type { ExplorerProgress } from "@/features/explorer/progression-types";
import { subscribeToProgress } from "@/features/explorer/progression-service";

type ExplorerProfile = {
  displayName: string;
  username: string;
};

const PROFILE_STORAGE_KEY = "the-center-explorer-profile";

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

const PROGRESS_STORAGE_KEY = "the-center-explorer-progress";

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

export function ExplorerHub() {
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
    // Ignore invalid stored progress data.
  }

  const isChapterCompleted = progress.completedChapters.includes("chapter-01");

  const savedProfile = useSyncExternalStore(
    subscribeToProfile,
    getStoredProfile,
    getServerProfile,
  );

  let profile: ExplorerProfile | null = null;

  try {
    profile = savedProfile ? JSON.parse(savedProfile) : null;
  } catch {
    // Ignore invalid stored profile data.
  }

  return (
    <main className="min-h-screen bg-background py-24">
      <Container>
        <div className="flex flex-col gap-12">
          <header className="border-b border-border pb-10">
            <span className="text-xs uppercase tracking-[0.3em] text-accent">
              Explorer Hub
            </span>

            <h1 className="mt-5 font-display text-4xl sm:text-5xl">
              Selamat datang,{" "}
              <span className="text-accent">
                {profile?.displayName || "Explorer"}.
              </span>
            </h1>

            <p className="mt-4 text-sm text-muted">
              @{profile?.username || "explorer"}
            </p>

            <p className="mt-6 max-w-xl text-sm leading-7 text-muted">
              Setiap perjalanan besar dimulai dengan satu langkah. Perjalananmu
              untuk memahami sejarah dan menemukan ruang kontribusimu dimulai
              dari sini.
            </p>
          </header>

          <section className="grid gap-4 sm:grid-cols-3">
            <div className="border border-border bg-surface/40 p-6">
              <span className="text-xs uppercase tracking-widest text-muted">
                Status
              </span>
              <p className="mt-3 font-display text-2xl">Explorer</p>
            </div>

            <div className="border border-border bg-surface/40 p-6">
              <span className="text-xs uppercase tracking-widest text-muted">
                Level
              </span>
              <p className="mt-3 font-display text-2xl">01</p>
            </div>

            <div className="border border-border bg-surface/40 p-6">
              <span className="text-xs uppercase tracking-widest text-muted">
                Experience Points
              </span>
              <p className="mt-3 font-display text-2xl">
                {progress.totalXP} XP
              </p>
            </div>
          </section>

          <section>
            <div className="mb-8 flex items-end justify-between">
              <div>
                <span className="text-xs uppercase tracking-widest text-accent">
                  Your Journey
                </span>
                <h2 className="mt-3 font-display text-3xl">
                  Perjalanan Sejarah
                </h2>
              </div>

              <Compass className="text-accent" size={26} />
            </div>

            <article className="relative overflow-hidden border border-border bg-surface/30 p-8 sm:p-12">
              <div className="pointer-events-none absolute right-0 top-0 h-full w-1/2 bg-[radial-gradient(ellipse_at_100%_50%,rgba(199,166,106,0.12),transparent_70%)]" />

              <div className="relative max-w-2xl">
                <span className="text-xs uppercase tracking-[0.25em] text-accent">
                  Chapter 01
                </span>
                {isChapterCompleted && (
                  <span className="mt-3 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-accent">
                    <Compass size={14} />
                    Chapter Completed
                  </span>
                )}

                <h3 className="mt-5 font-display text-3xl sm:text-4xl">
                  The First Foundations
                </h3>

                <p className="mt-5 text-sm leading-8 text-muted">
                  Menelusuri jejak awal dua tempat suci yang memiliki kedudukan
                  penting dalam sejarah manusia: Masjidil Haram dan Masjidil
                  Aqsa.
                </p>

                <Link
                  href="/chapters/01"
                  className="mt-8 inline-flex items-center gap-3 bg-accent px-6 py-4 text-sm font-medium text-background transition-colors hover:bg-accent-hover"
                >
                  {isChapterCompleted
                    ? "Jelajahi Kembali Chapter"
                    : "Mulai Chapter 01"}
                  <ArrowRight size={16} />
                </Link>
              </div>
            </article>
          </section>

          <section className="grid gap-4 md:grid-cols-2">
            <Link
              href="/journal"
              className="group block border border-border p-6 transition-colors hover:border-accent"
            >
              <BookOpen size={22} className="text-accent" />

              <h2 className="mt-5 font-display text-xl">Jurnal Perjalanan</h2>

              <p className="mt-2 text-sm leading-7 text-muted">
                Lihat seluruh penemuan, petunjuk, dan refleksi yang telah kamu
                kumpulkan.
              </p>
            </Link>

            <div className="border border-border p-7">
              <Sparkles size={22} className="text-accent" />

              <h3 className="mt-5 font-display text-2xl">Pencapaianmu</h3>

              {progress.badges.length > 0 ? (
                <div className="mt-5 flex flex-col gap-4">
                  {progress.badges.map((badge) => (
                    <div
                      key={badge.id}
                      className="border border-border bg-surface/40 p-4"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{badge.icon}</span>

                        <div>
                          <h4 className="font-medium">{badge.title}</h4>
                          <p className="mt-1 text-sm leading-6 text-muted">
                            {badge.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-sm leading-7 text-muted">
                  Belum ada pencapaian. Selesaikan perjalanan dan tantangan
                  untuk mengumpulkan pencapaian pertamamu.
                </p>
              )}
            </div>
          </section>

          <footer className="flex items-center gap-3 border-t border-border pt-6 text-xs text-subtle">
            <ScrollText size={16} />
            Perjalananmu baru saja dimulai.
          </footer>
        </div>
      </Container>
    </main>
  );
}
