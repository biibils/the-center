import Link from "next/link";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Container } from "@/components/ui/container";

export function Navbar() {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-xl">
      <Container>
        <nav className="flex h-20 items-center justify-between">
          <Link href="/" className="flex flex-col">
            <span className="font-display text-xl tracking-[0.2em]">
              THE CENTER
            </span>
            <span className="text-[9px] tracking-[0.25em] text-muted">
              CIVILIZATION BUILDING ECOSYSTEM
            </span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <Link
              href="#mission"
              className="text-sm text-muted transition-colors hover:text-foreground"
            >
              Our Mission
            </Link>

            <Link
              href="#journey"
              className="text-sm text-muted transition-colors hover:text-foreground"
            >
              The Journey
            </Link>

            <Link
              href="#about"
              className="text-sm text-muted transition-colors hover:text-foreground"
            >
              About
            </Link>
          </div>

          <ThemeToggle />
        </nav>
      </Container>
    </header>
  );
}
