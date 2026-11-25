"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown, ArrowRight, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CivilizationCanvas } from "./scene/civilization-astrolabe";

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

  useEffect(() => {
    const ctx = gsap.context(() => {
      const stages = stageRefs.current.filter(Boolean) as HTMLDivElement[];

      stages.forEach((stage, i) => {
        if (i === 0) {
          gsap.set(stage, {
            opacity: 1,
            scale: 1,
            y: 0,
            pointerEvents: "auto",
          });
        } else {
          gsap.set(stage, {
            opacity: 0,
            scale: 0.92,
            y: 24,
            pointerEvents: "none",
          });
        }
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          onUpdate: (self) => {
            progressRef.current = self.progress;
            const idx = Math.min(
              chapters.length - 1,
              Math.floor(self.progress * chapters.length),
            );
            setActiveIndex(idx);
          },
        },
      });

      stages.forEach((stage, i) => {
        const nextStage = stages[i + 1];
        if (!nextStage) return;

        const position = i;

        tl.to(
          stage,
          {
            opacity: 0,
            scale: 1.07,
            y: -24,
            pointerEvents: "none",
            duration: 0.45,
            ease: "power2.inOut",
          },
          position + 0.35,
        );

        tl.fromTo(
          nextStage,
          {
            opacity: 0,
            scale: 0.92,
            y: 24,
            pointerEvents: "none",
          },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            pointerEvents: "auto",
            duration: 0.5,
            ease: "power2.out",
          },
          position + 0.5,
        );
      });
    }, triggerRef);

    return () => ctx.revert();
  }, []);

  const jumpToChapter = (index: number) => {
    if (!triggerRef.current) return;
    const totalScroll = triggerRef.current.offsetHeight - window.innerHeight;
    const targetProgress = index === 0 ? 0 : (index + 0.35) / chapters.length;
    window.scrollTo({
      top: totalScroll * Math.min(1, targetProgress),
      behavior: "smooth",
    });
  };

  // Tambahkan di dalam komponen CinematicExperience, tepat di bawah fungsi jumpToChapter:

  // 1. Kirim status babak aktif ke Navbar
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("center:chapter-change", {
        detail: { index: activeIndex },
      }),
    );
  }, [activeIndex]);

  // 2. Tangkap event klik dari Navbar & initial URL hash (#mission, #journey, #about)
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

    // Cek jika user datang dari halaman lain dengan membawa hash (misal /#mission)
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

  return (
    <>
      <CivilizationCanvas progressRef={progressRef} />

      <div ref={triggerRef} className="relative z-10 h-[600vh] w-full">
        <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden px-6 pt-20">
          {/* Optical Focus Aura agar kontras baca tetap terjaga di Light & Dark mode */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_52%_46%_at_50%_50%,var(--background)_22%,transparent_100%)] opacity-90"
          />

          {/* Bingkai Arsitektural Tipis (Museum / Astrolabe Frame) */}
          <div
            aria-hidden="true"
            className="pointer-events-none fixed inset-x-6 bottom-14 top-24 z-10 hidden border border-border/70 md:block lg:inset-x-10"
          >
            {/* Penanda Sudut Instrumen */}
            <span className="absolute -left-px -top-px h-3 w-3 border-l border-t border-accent" />
            <span className="absolute -right-px -top-px h-3 w-3 border-r border-t border-accent" />
            <span className="absolute -bottom-px -left-px h-3 w-3 border-b border-l border-accent" />
            <span className="absolute -bottom-px -right-px h-3 w-3 border-b border-r border-accent" />
          </div>

          {/* =========================================================
              BABAK 0: PROLOGUE (MONUMENTAL EDITORIAL)
          ========================================================= */}
          <div
            ref={(el) => {
              stageRefs.current[0] = el;
            }}
            className="absolute inset-x-0 mx-auto flex max-w-4xl flex-col items-center px-8 text-center will-change-transform"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-accent sm:text-[11px]">
              Prologue — Perjalanan Melampaui Waktu
            </p>

            <div className="my-3.5 h-5 w-px bg-accent/50 xl:my-4 xl:h-6" />

            <h1 className="font-display text-4xl leading-[1.12] tracking-tight sm:text-5xl md:text-6xl xl:text-[4.25rem]">
              Menelusuri <span className="text-accent">Masa Lalu.</span>
              <br />
              Membangun <span className="italic">Masa Depan.</span>
            </h1>

            <p className="mt-5 max-w-lg text-sm leading-relaxed text-muted sm:text-[15px] sm:leading-7 xl:mt-6 xl:max-w-xl">
              Sebuah perjalanan menelusuri sejarah, pengetahuan, dan potensi
              manusia. Temukan kisah-kisah yang membentuk peradaban, lalu ambil
              bagian dalam sejarah yang belum selesai ditulis.
            </p>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-5 xl:mt-8">
              <Link href="/prologue">
                <Button>
                  Mulai Perjalananmu
                  <ArrowRight size={16} />
                </Button>
              </Link>

              <button
                type="button"
                onClick={() => jumpToChapter(1)}
                className="inline-flex cursor-pointer items-center gap-2 border-b border-border pb-1 text-xs uppercase tracking-[0.2em] text-muted transition-colors hover:border-accent hover:text-foreground"
              >
                Telusuri Empat Pilar
                <ArrowDown size={13} className="text-accent" />
              </button>
            </div>
          </div>

          {/* =========================================================
              BABAK I - IV: LEMBAR MANUSKRIP ASIMETRIS (HISTORICAL FOLIO)
          ========================================================= */}
          {pillars.map((pillar, idx) => {
            const stageIdx = idx + 1;

            return (
              <div
                key={pillar.roman}
                ref={(el) => {
                  stageRefs.current[stageIdx] = el;
                }}
                className="absolute inset-x-0 mx-auto w-full max-w-4xl px-8 will-change-transform md:px-14"
              >
                <div className="grid items-center gap-8 md:grid-cols-[140px_1px_1fr] md:gap-12">
                  {/* Kolom Kiri: Angka Romawi Klasik */}
                  <div className="flex flex-col items-start md:items-end md:text-right">
                    <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-subtle">
                      Pilar
                    </span>
                    <span className="font-display text-6xl leading-none text-accent sm:text-7xl md:text-8xl">
                      {pillar.roman}
                    </span>
                  </div>

                  {/* Garis Pemisah Vertikal */}
                  <div className="hidden h-44 w-px bg-border md:block" />

                  {/* Kolom Kanan: Narasi Kuratorial */}
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent">
                      {pillar.index}
                    </p>

                    <h2 className="mt-3 font-display text-4xl tracking-tight sm:text-5xl md:text-6xl">
                      {pillar.title}
                    </h2>

                    <p className="mt-2 font-display text-base italic text-foreground/80 sm:text-lg">
                      {pillar.latinNote}
                    </p>

                    <div className="my-5 h-px w-16 bg-accent/60" />

                    <p className="max-w-xl text-base leading-8 text-muted">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}

          {/* =========================================================
              BABAK V: THE CHARTER / PENUTUP FILOSOFIS
          ========================================================= */}
          <div
            ref={(el) => {
              stageRefs.current[5] = el;
            }}
            className="absolute inset-x-0 mx-auto flex max-w-3xl flex-col items-center px-6 text-center will-change-transform"
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-accent">
              The Center Philosophy
            </p>

            <blockquote className="mt-6 font-display text-3xl leading-snug sm:text-5xl md:text-[3.25rem]">
              “Build People.
              <br />
              Empower Collaboration.
              <br />
              <span className="text-accent italic">Revive Civilization.”</span>
            </blockquote>

            <div className="my-7 h-px w-24 bg-border" />

            <p className="max-w-lg text-sm leading-7 text-muted sm:text-base">
              Berakar dari nilai-nilai Islam. Terbuka untuk Kemanusiaan. Sebuah
              ekosistem yang didedikasikan untuk membentuk manusia
              berpengetahuan, berkompeten, dan berprinsip.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-5">
              <Link href="/prologue">
                <Button>
                  Masuki Prologue
                  <ArrowRight size={16} />
                </Button>
              </Link>

              <button
                type="button"
                onClick={() => jumpToChapter(0)}
                className="inline-flex cursor-pointer items-center gap-1.5 border-b border-border pb-1 font-mono text-xs uppercase tracking-[0.2em] text-muted transition-colors hover:border-accent hover:text-foreground"
              >
                Kembali ke Awal
                <ArrowUpRight size={14} />
              </button>
            </div>
          </div>

          {/* =========================================================
              INDEKS MANUSKRIP (SISI KANAN LAYAR)
          ========================================================= */}
          <aside
            aria-label="Chapter Index"
            className="fixed right-14 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-end gap-3.5 xl:flex"
          >
            {chapters.map((chapter, idx) => {
              const isActive = activeIndex === idx;
              return (
                <button
                  key={chapter.id}
                  type="button"
                  onClick={() => jumpToChapter(idx)}
                  className="group flex cursor-pointer items-center gap-3 text-right"
                >
                  <span
                    className={`font-mono text-[10px] uppercase tracking-[0.22em] transition-all duration-300 ${
                      isActive
                        ? "text-accent opacity-100"
                        : "text-subtle opacity-0 group-hover:opacity-100"
                    }`}
                  >
                    {chapter.label}
                  </span>

                  <span
                    className={`font-display text-xs transition-colors ${
                      isActive
                        ? "text-accent"
                        : "text-subtle group-hover:text-foreground"
                    }`}
                  >
                    {chapter.roman}
                  </span>
                </button>
              );
            })}
          </aside>

          {/* =========================================================
              BARIS KOORDINAT BAWAH VIEWPORT
          ========================================================= */}
          <div className="pointer-events-none fixed inset-x-6 bottom-0 z-20 flex h-14 items-center justify-between text-[10px] uppercase tracking-[0.25em] text-subtle lg:inset-x-10">
            <span className="hidden sm:inline">
              Berakar pada Nilai-Nilai Islam · Terbuka bagi Kemanusiaan
            </span>

            <span className="font-mono text-accent">
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
