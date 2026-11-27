"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown, ArrowRight, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimeDepthWorldCanvas } from "./components/anime-depth-world-canvas";
import { playCinematicSfx } from "@/components/shared/ambient-sound-toggle";
import { CinematicPreloader } from "@/components/shared/cinematic-preloader";

gsap.registerPlugin(ScrollTrigger);

const chapters = [
  { id: "prologue", roman: "0", label: "Prologue" },
  { id: "awareness", roman: "I", label: "Awareness" },
  { id: "understanding", roman: "II", label: "Understanding" },
  { id: "action", roman: "III", label: "Action" },
  { id: "civilization", roman: "IV", label: "Civilization" },
  { id: "epilogue", roman: "V", label: "The Charter" },
];

const pillars = [
  {
    roman: "I",
    index: "STAGE 01 — KESADARAN",
    title: "Awareness",
    latinNote: "Al-Wa'y · Membaca Jejak Zaman",
    description:
      "Mengenali kisah, tantangan, dan pertanyaan mendasar yang membentuk cara manusia memahami dunia—menyadari bahwa hari ini berdiri di atas bahu sejarah panjang.",
  },
  {
    roman: "II",
    index: "STAGE 02 — PEMAHAMAN",
    title: "Understanding",
    latinNote: "Al-Fahm · Menelusuri Akar Ilmu",
    description:
      "Menelusuri sejarah secara jernih, memperluas cakrawala pengetahuan, dan menempa nalar kritis agar tidak sekadar menjadi pengikut arus zaman.",
  },
  {
    roman: "III",
    index: "STAGE 03 — AKSI NYATA",
    title: "Action",
    latinNote: "Al-'Amal · Menempa Karya",
    description:
      "Menerjemahkan apa yang dipelajari menjadi kecakapan, inisiatif nyata, dan kontribusi yang menghadirkan manfaat terukur bagi masyarakat.",
  },
  {
    roman: "IV",
    index: "STAGE 04 — PERADABAN",
    title: "Civilization",
    latinNote: "Al-'Umran · Membangun Kemanusiaan",
    description:
      "Membangun manusia berprinsip, menghidupkan kolaborasi lintas disiplin, dan mewariskan masa depan yang bermartabat bagi kemanusiaan.",
  },
];

export function CinematicExperience() {
  const triggerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<number>(0);
  const stageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isWorldReady, setIsWorldReady] = useState(false);

  useEffect(() => {
    const stages = stageRefs.current.filter(Boolean) as HTMLDivElement[];
    const maxIndex = chapters.length - 1; // 5 interval untuk 6 bab

    const renderStages = (progress: number) => {
      const exactStage = progress * maxIndex; // Rentang 0.0 -> 5.0
      const currentIdx = Math.min(
        maxIndex,
        Math.max(0, Math.round(exactStage)),
      );
      setActiveIndex(currentIdx);

      stages.forEach((stage, i) => {
        const diff = exactStage - i; // 0 saat tepat berada di bab i
        const absDiff = Math.abs(diff);

        // Zona diam penuh di sekitar titik bab (-0.22 s/d +0.22) agar teks tajam 100%
        if (absDiff <= 0.22) {
          gsap.set(stage, {
            opacity: 1,
            scale: 1,
            y: 0,
            pointerEvents: "auto",
          });
        } else if (absDiff < 0.52) {
          // Transisi halus hanya di celah antar-bab (0.22 -> 0.52)
          const t = (absDiff - 0.22) / 0.3; // 0 -> 1
          const eased = t * t * (3 - 2 * t); // smoothstep
          gsap.set(stage, {
            opacity: 1 - eased,
            scale: diff > 0 ? 1 + eased * 0.05 : 1 - eased * 0.06,
            y: diff > 0 ? -eased * 20 : eased * 20,
            pointerEvents: "none",
          });
        } else {
          gsap.set(stage, {
            opacity: 0,
            scale: diff > 0 ? 1.05 : 0.94,
            y: diff > 0 ? -20 : 20,
            pointerEvents: "none",
          });
        }
      });
    };

    renderStages(0);

    const st = ScrollTrigger.create({
      trigger: triggerRef.current,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.2,
      onUpdate: (self) => {
        progressRef.current = self.progress;
        renderStages(self.progress);
      },
    });

    return () => st.kill();
  }, []);

  const jumpToChapter = (index: number) => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const triggerTop = window.scrollY + rect.top;
    const totalScroll = triggerRef.current.offsetHeight - window.innerHeight;
    const targetProgress = index / (chapters.length - 1);

    window.scrollTo({
      top: triggerTop + totalScroll * Math.min(1, Math.max(0, targetProgress)),
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("center:chapter-change", {
        detail: { index: activeIndex },
      }),
    );
  }, [activeIndex]);

  useEffect(() => {
    const hashMap: Record<string, number> = {
      "#mission": 1,
      "#journey": 3,
      "#about": 5,
    };

    const handleJumpEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ index: number }>;
      jumpToChapter(customEvent.detail.index);
    };

    window.addEventListener("center:jump-chapter", handleJumpEvent);

    const initialHash = window.location.hash;
    if (initialHash && hashMap[initialHash] !== undefined) {
      const timer = setTimeout(() => {
        jumpToChapter(hashMap[initialHash]);
      }, 150);
      return () => {
        clearTimeout(timer);
        window.removeEventListener("center:jump-chapter", handleJumpEvent);
      };
    }

    return () => {
      window.removeEventListener("center:jump-chapter", handleJumpEvent);
    };
  }, []);

  useEffect(() => {
    if (!isWorldReady) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      ScrollTrigger.refresh();
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isWorldReady]);

  return (
    <>
      <CinematicPreloader
        subtitle="MEMBUKA GERBANG PERADABAN..."
        requireInteraction
        enterLabel="Masuk ke The Center"
        images={[
          "/images/landing-world.webp",
          "/images/landing-world-depth.webp",
        ]}
        audios={["/audio/landing-the-kingdom-of-wonder.mp3"]}
        onComplete={() => setIsWorldReady(true)}
      />

      <AnimeDepthWorldCanvas
        progressRef={progressRef}
        colorMapSrc="/images/landing-world.webp"
        depthMapSrc="/images/landing-world-depth.webp"
      />

      <div ref={triggerRef} className="relative z-10 h-[600vh] w-full">
        <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden px-6 pt-6 md:justify-start">
          {/* Pendar Radial Lembut Khusus di Sisi Kiri (Area Teks) — Kanan (Kubah) tetap 100% Jernih */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_62%_65%_at_50%_50%,var(--background)_20%,transparent_100%)] opacity-85 md:bg-[radial-gradient(ellipse_48%_68%_at_24%_50%,var(--background)_22%,transparent_100%)] md:opacity-75"
          />

          {/* Bingkai Arsitektural Tipis */}
          <div
            aria-hidden="true"
            className="pointer-events-none fixed inset-x-6 bottom-14 top-24 z-10 hidden border border-border/70 md:block lg:inset-x-10"
          >
            <span className="absolute -left-px -top-px h-3 w-3 border-l border-t border-accent" />
            <span className="absolute -right-px -top-px h-3 w-3 border-r border-t border-accent" />
            <span className="absolute -bottom-px -left-px h-3 w-3 border-b border-l border-accent" />
            <span className="absolute -bottom-px -right-px h-3 w-3 border-b border-r border-accent" />
          </div>

          {/* =========================================================
              BABAK 0: PROLOGUE (RATA KIRI)
          ========================================================= */}
          <div
            ref={(el) => {
              stageRefs.current[0] = el;
            }}
            className="absolute left-0 flex w-full max-w-3xl flex-col items-center px-8 text-center will-change-transform md:items-start md:pl-16 md:pr-8 md:text-left lg:pl-24"
          >
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="hidden h-px w-6 bg-accent/80 dark:bg-accent/80 md:inline-block"
              />
              <p className="font-mono text-sm font-bold uppercase tracking-[0.28em] text-accent [text-shadow:0_1px_12px_var(--background),0_0_24px_var(--background)] dark:text-accent sm:text-[13px]">
                Perjalanan Melampaui Waktu
              </p>
            </div>

            <div className="my-3 h-4 w-px bg-accent/70" />

            <h1 className="font-display text-3xl leading-[1.14] tracking-tight text-foreground sm:text-5xl md:text-[3rem] xl:text-[3.55rem]">
              <span className="block sm:whitespace-nowrap">
                Menelusuri{" "}
                <span className="text-accent [text-shadow:0_1px_12px_var(--background),0_0_24px_var(--background)]">
                  Masa Lalu.
                </span>
              </span>
              <span className="block sm:whitespace-nowrap">
                Membangun <span className="italic">Masa Depan.</span>
              </span>
            </h1>

            <p className="mt-4 max-w-md text-sm font-medium leading-relaxed text-foreground/90 sm:text-[15px] sm:leading-7 xl:mt-5 xl:max-w-lg">
              Sebuah perjalanan menelusuri sejarah, pengetahuan, dan potensi
              manusia. Temukan kisah-kisah yang membentuk peradaban, lalu ambil
              bagian dalam sejarah yang belum selesai ditulis.
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-5 md:justify-start xl:mt-7">
              <Link href="/prologue">
                <Button>
                  Mulai Perjalananmu
                  <ArrowRight size={16} />
                </Button>
              </Link>

              <button
                type="button"
                onClick={() => jumpToChapter(1)}
                onMouseEnter={() => playCinematicSfx("hover")}
                className="group relative inline-flex cursor-pointer items-center gap-2.5 pb-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-foreground/85 transition-colors duration-300 hover:text-accent"
              >
                <ArrowDown
                  size={15}
                  className="text-accent transition-transform duration-300 ease-out group-hover:translate-y-1"
                />

                <span>Telusuri Empat Pilar</span>

                {/* Garis dasar statis */}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-0.5 bg-foreground/25"
                />

                {/* Garis emas yang meluncur penuh saat hover */}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-accent transition-transform duration-300 ease-out group-hover:scale-x-100"
                />
              </button>
            </div>
          </div>

          {/* =========================================================
              BABAK I - IV: EMPAT PILAR (RATA KIRI)
          ========================================================= */}
          {pillars.map((pillar, idx) => {
            const stageIdx = idx + 1;

            return (
              <div
                key={pillar.roman}
                ref={(el) => {
                  stageRefs.current[stageIdx] = el;
                }}
                className="absolute left-0 w-full max-w-2xl px-8 will-change-transform md:pl-16 md:pr-8 lg:pl-24"
              >
                <div className="flex flex-col items-start">
                  {/* Header Pilar & Angka Romawi */}
                  <div className="flex items-baseline gap-4">
                    <span className="font-display text-5xl leading-none text-accent sm:text-6xl">
                      {pillar.roman}
                    </span>
                    <span className="h-6 w-px bg-border" />
                    <p className="font-mono text-sm font-semibold uppercase tracking-[0.28em] text-accent">
                      {pillar.index}
                    </p>
                  </div>

                  <h2 className="mt-4 font-display text-4xl tracking-tight text-foreground sm:text-5xl md:text-[3.5rem]">
                    {pillar.title}
                  </h2>

                  <p className="mt-2 font-display text-base italic text-foreground/85 sm:text-lg">
                    {pillar.latinNote}
                  </p>

                  <div className="my-5 h-px w-16 bg-accent/70" />

                  <p className="max-w-lg text-sm font-medium leading-7 text-foreground/90 sm:text-base sm:leading-8">
                    {pillar.description}
                  </p>
                </div>
              </div>
            );
          })}

          {/* =========================================================
              BABAK V: THE CHARTER / PENUTUP FILOSOFIS (RATA KIRI)
          ========================================================= */}
          <div
            ref={(el) => {
              stageRefs.current[5] = el;
            }}
            className="absolute left-0 flex w-full max-w-2xl flex-col items-center px-8 text-center will-change-transform md:items-start md:pl-16 md:pr-8 md:text-left lg:pl-24"
          >
            <p className="font-mono text-sm font-semibold uppercase tracking-[0.35em] text-accent">
              The Center Philosophy
            </p>

            <blockquote className="leading-snug mt-5 font-display text-3xl sm:whitespace-nowrap text-foreground sm:text-4xl md:text-[2.85rem]">
              “Build People. Empower <br />
              Collaboration.
              <br />
              <span className="italic text-accent">Revive Civilization.”</span>
            </blockquote>

            <div className="my-6 h-px w-20 bg-border" />

            <p className="max-w-md text-sm font-medium leading-7 text-foreground/90 sm:text-base">
              Berakar dari nilai-nilai Islam. Terbuka untuk Kemanusiaan. Sebuah
              ekosistem yang didedikasikan untuk membentuk manusia
              berpengetahuan, berkompeten, dan berprinsip.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-5 md:justify-start">
              <Link href="/prologue">
                <Button>
                  Masuki Prologue
                  <ArrowRight size={16} />
                </Button>
              </Link>

              <button
                type="button"
                onClick={() => jumpToChapter(0)}
                onMouseEnter={() => playCinematicSfx("hover")}
                className="group relative inline-flex cursor-pointer items-center gap-2.5 pb-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-foreground/85 transition-colors duration-300 hover:text-accent"
              >
                <span>Kembali ke Awal</span>

                <ArrowUpRight
                  size={15}
                  className="text-accent transition-transform duration-300 ease-out group-hover:-translate-y-1"
                />

                {/* Garis dasar statis */}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-0.5 bg-foreground/25"
                />

                {/* Garis emas yang meluncur penuh saat hover */}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-accent transition-transform duration-300 ease-out group-hover:scale-x-100"
                />
              </button>
            </div>
          </div>

          {/* =========================================================
              INDEKS MANUSKRIP (SISI KANAN LAYAR)
          ========================================================= */}
          <aside
            aria-label="Chapter Index"
            className="pointer-events-none fixed inset-y-0 right-0 z-20 hidden w-48 items-center justify-end bg-linear-to-l from-background/75 via-background/65 to-transparent pr-14 xl:flex"
          >
            <div className="pointer-events-auto flex flex-col items-end gap-4">
              {chapters.map((chapter, idx) => {
                const isActive = activeIndex === idx;
                return (
                  <button
                    key={chapter.id}
                    type="button"
                    onClick={() => jumpToChapter(idx)}
                    className="group flex cursor-pointer items-center gap-3 text-right"
                  >
                    {/* Angka Romawi */}
                    <span
                      className={`w-4 text-right font-display text-xs font-bold transition-colors ${
                        isActive
                          ? "text-accent"
                          : "text-foreground/85 group-hover:text-foreground"
                      }`}
                    >
                      {chapter.roman}
                    </span>

                    {/* Garis Indikator Astrolabe */}
                    <span
                      className={`h-px transition-all duration-300 ${
                        isActive
                          ? "w-6 bg-accent"
                          : "w-2.5 bg-foreground/45 group-hover:w-4 group-hover:bg-foreground"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </aside>

          {/* =========================================================
              BARIS KOORDINAT BAWAH VIEWPORT (FOOTER)
          ========================================================= */}
          <div className="pointer-events-none fixed inset-x-0 bottom-0 z-20 flex h-14 items-center justify-between bg-linear-to-t from-background/90 via-background/60 to-transparent px-6 text-[10px] font-semibold uppercase tracking-[0.25em] text-foreground lg:px-10">
            <span className="hidden sm:inline">
              Berakar pada Nilai-Nilai Islam · Terbuka bagi Kemanusiaan
            </span>

            <span className="font-mono font-bold text-accent">
              STAGE {chapters[activeIndex]?.roman} —{" "}
              {chapters[activeIndex]?.label}
            </span>

            <span className="hidden items-center gap-2 md:inline-flex">
              Scroll untuk Menjelajah
              <ArrowDown size={11} className="text-accent" />
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
