import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";

export function Footer() {
  return (
    <footer id="about" className="border-t border-border bg-surface/40">
      <Container>
        <div className="grid gap-12 py-16 md:grid-cols-2">
          <div>
            <Link href="/" className="inline-flex flex-col">
              <span className="font-display text-2xl tracking-[0.2em]">
                THE CENTER
              </span>
              <span className="mt-1 text-[9px] tracking-[0.25em] text-muted">
                CIVILIZATION BUILDING ECOSYSTEM
              </span>
            </Link>

            <p className="mt-6 max-w-sm text-sm leading-7 text-muted">
              Sebuah ekosistem yang didedikasikan untuk membentuk manusia
              berpengetahuan, berkompeten, dan berprinsip, yang mampu
              berkontribusi bagi masa depan peradaban.
            </p>
          </div>

          <div className="flex flex-col justify-between gap-8 md:items-end">
            <div className="flex flex-wrap gap-x-8 gap-y-4 text-sm text-muted">
              <Link href="#mission" className="hover:text-foreground">
                Misi Kami
              </Link>
              <Link href="#journey" className="hover:text-foreground">
                Perjalanan
              </Link>
              <Link href="#about" className="hover:text-foreground">
                Tentang Kami
              </Link>
            </div>

            <p className="font-display text-lg italic text-foreground md:text-right">
              Berakar dari nilai-nilai Islam.
              <br />
              Terbuka untuk Kemanusiaan.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-border py-6 text-xs text-subtle sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} The Center. Hak Cipta dilindungi.</p>

          <Link
            href="#"
            className="inline-flex items-center gap-2 transition-colors hover:text-accent"
          >
            Kembali ke atas
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </Container>
    </footer>
  );
}
