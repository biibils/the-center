"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { TheCenterLogo } from "@/components/shared/the-center-logo";
import { Container } from "@/components/ui/container";
import { AmbientSoundToggle } from "../shared/ambient-sound-toggle";
import { Compass, LogIn } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { playCinematicSfx } from "@/components/shared/ambient-sound-toggle";

const navItems = [
  { label: "Journey", hash: "journey", chapterIndex: 1 },
  { label: "Tentang Kami", hash: "about", chapterIndex: 5 },
];

export function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [activeChapter, setActiveChapter] = useState<number>(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsAuthenticated(Boolean(user));
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(Boolean(session?.user));
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <header className="fixed top-0 z-50 w-full border-b border-border/80 bg-background/45 backdrop-blur-md transition-colors">
      <Container>
        <nav className="flex h-20 items-center justify-between">
          <TheCenterLogo
            href="/"
            size="md"
            adaptiveTheme
            subtitle="CIVILIZATION BUILDING ECOSYSTEM"
            onClick={(e) => handleNavigate(e, 0)}
          />

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
                    className={`absolute inset-x-0 -bottom-1 h-px origin-left bg-accent transition-transform duration-300 ${
                      active ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <AmbientSoundToggle />

            <Link
              href={isAuthenticated ? "/explorer" : "/login"}
              onMouseEnter={() => playCinematicSfx("hover")}
              className="inline-flex items-center gap-2 border border-white/20 bg-background/70 px-3.5 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-foreground backdrop-blur-md transition-all hover:border-accent hover:text-accent"
            >
              {isAuthenticated ? (
                <>
                  <Compass size={12} className="text-accent" />
                  <span>Sanctuary</span>
                </>
              ) : (
                <>
                  <LogIn size={12} className="text-accent" />
                  <span>Masuk</span>
                </>
              )}
            </Link>
          </div>
        </nav>
      </Container>
    </header>
  );
}
