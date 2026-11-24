import Link from "next/link";
import { ArrowDown, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-background">
      {/* Atmospheric background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_45%,rgba(199,166,106,0.10),transparent_55%)]" />
        <div className="absolute inset-0 bg-linear-to-b from-background/10 via-background/20 to-background" />
      </div>

      <Container className="relative z-10">
        <div className="max-w-4xl pt-24">
          <div className="mb-8 flex items-center gap-4">
            <span className="h-px w-10 bg-accent" />
            <span className="text-xs font-medium uppercase tracking-[0.3em] text-accent">
              Perjalanan yang Melampaui Waktu
            </span>
          </div>

          <h1 className="font-display text-5xl leading-[1.15] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
            Menelusuri
            <br />
            <span className="text-accent">Masa Lalu.</span>
            <br />
            Membangun
            <br />
            <span className="italic">Masa Depan.</span>
          </h1>

          <p className="mt-8 max-w-xl text-base leading-8 text-muted md:text-lg">
            Sebuah perjalanan menelusuri sejarah, pengetahuan, dan potensi
            manusia. Temukan kisah-kisah yang membentuk peradaban, lalu temukan
            bagaimana dirimu dapat mengambil bagian dalam sejarah yang belum
            selesai ditulis.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link href="/prologue">
              <Button>
                Mulai Perjalananmu
                <ArrowRight size={16} />
              </Button>
            </Link>

            <Link
              href="#mission"
              className="inline-flex items-center gap-2 px-5 py-3 text-sm text-muted transition-colors hover:text-foreground"
            >
              Kenali The Center
            </Link>
          </div>
        </div>

        <div className="mt-24 flex items-center justify-between border-t border-border pt-6">
          <p className="text-[10px] uppercase tracking-[0.25em] text-subtle">
            Berakar pada Nilai-Nilai Islam. Terbuka bagi Kemanusiaan.
          </p>

          <a
            href="#mission"
            aria-label="Scroll to mission"
            className="text-muted transition-colors hover:text-accent"
          >
            <ArrowDown size={20} />
          </a>
        </div>
      </Container>
    </section>
  );
}
