"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Container } from "@/components/ui/container";
import { AmbientSoundToggle } from "../shared/ambient-sound-toggle";

const navItems = [
  { label: "Misi Kami", hash: "mission", chapterIndex: 0 },
  { label: "The Journey", hash: "journey", chapterIndex: 1 },
  { label: "Tentang Kami", hash: "about", chapterIndex: 5 },
];

export function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [activeChapter, setActiveChapter] = useState<number>(0);

  // Dengarkan perubahan babak dari CinematicExperience untuk highlight menu aktif
  useEffect(() => {
    const handleChapterChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ index: number }>;
      setActiveChapter(customEvent.detail.index);
    };

    window.addEventListener("center:chapter-change", handleChapterChange);
    return () =>
      window.removeEventListener("center:chapter-change", handleChapterChange);
  }, []);

  const handleNavigate = (
    e: React.MouseEvent<HTMLAnchorElement>,
    chapterIndex: number,
    hash?: string,
  ) => {
    if (!isHome) return; // Biarkan Next.js berpindah ke `/#hash` jika sedang di halaman lain

    e.preventDefault();
    if (hash) {
      window.history.replaceState(null, "", `#${hash}`);
    } else {
      window.history.replaceState(null, "", "/");
    }

    window.dispatchEvent(
      new CustomEvent("center:jump-chapter", {
        detail: { index: chapterIndex },
      }),
    );
  };

  // Tentukan menu mana yang sedang aktif berdasarkan rentang babak
  const isItemActive = (hash: string) => {
    if (!isHome) return false;
    if (hash === "mission") return activeChapter === 1 || activeChapter === 2;
    if (hash === "journey") return activeChapter === 3 || activeChapter === 4;
    if (hash === "about") return activeChapter === 5;
    return false;
  };

  return (
    <header className="fixed top-0 z-50 w-full border-b border-border/80 bg-background/45 backdrop-blur-md transition-colors">
      <Container>
        <nav className="flex h-20 items-center justify-between">
          <Link
            href="/"
            onClick={(e) => handleNavigate(e, 0)}
            className="flex flex-col"
          >
            <span className="font-display text-xl tracking-[0.2em]">
              THE CENTER
            </span>
            <span className="text-[9px] tracking-[0.25em] text-muted">
              CIVILIZATION BUILDING ECOSYSTEM
            </span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => {
              const active = isItemActive(item.hash);
              return (
                <Link
                  key={item.hash}
                  href={`/#${item.hash}`}
                  onClick={(e) =>
                    handleNavigate(e, item.chapterIndex, item.hash)
                  }
                  className={`relative py-1 text-sm transition-colors ${
                    active
                      ? "text-foreground"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  {item.label}
                  {/* Garis indikator aktif khas editorial */}
                  <span
                    className={`absolute inset-x-0 -bottom-1 h-px bg-accent transition-transform duration-300 origin-left ${
                      active ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <AmbientSoundToggle />
            <ThemeToggle />
          </div>
        </nav>
      </Container>
    </header>
  );
}
