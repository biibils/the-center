import {
  BookOpen,
  Compass,
  Lightbulb,
  Landmark,
  ArrowRight,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

const pillars = [
  {
    number: "01",
    title: "Awareness",
    description:
      "Mengenali kisah, tantangan, dan pertanyaan yang membentuk cara kita memahami dunia.",
    icon: Compass,
  },
  {
    number: "02",
    title: "Understanding",
    description:
      "Menelusuri sejarah, memperluas pengetahuan, dan mengembangkan kemampuan berpikir kritis.",
    icon: BookOpen,
  },
  {
    number: "03",
    title: "Action",
    description:
      "Mengubah apa yang dipelajari menjadi keterampilan, inisiatif, dan kontribusi yang bermakna.",
    icon: Lightbulb,
  },
  {
    number: "04",
    title: "Civilization",
    description:
      "Membangun manusia, memberdayakan kolaborasi, dan berkontribusi bagi masa depan yang lebih baik bagi kemanusiaan.",
    icon: Landmark,
  },
];

export function MissionSection() {
  return (
    <Section id="mission" spacing="large">
      <Container>
        <div className="mb-16 grid gap-8 md:grid-cols-2 md:items-end">
          <div>
            <span className="text-xs font-medium uppercase tracking-[0.3em] text-accent">
              Misi Kami
            </span>

            <h2 className="mt-5 font-display text-4xl leading-tight sm:text-5xl">
              Dari Pengetahuan
              <br />
              menuju <span className="text-accent italic">Peradaban.</span>
            </h2>
          </div>

          <p className="max-w-lg text-base leading-8 text-muted md:justify-self-end">
            Peradaban tidak dibangun dalam semalam. Ia tumbuh melalui generasi
            manusia yang terus belajar, berkembang, berkarya, dan berkontribusi
            untuk sesuatu yang lebih besar dari dirinya sendiri.
          </p>
        </div>

        <div className="grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;

            return (
              <article
                key={pillar.number}
                className="group flex min-h-72 flex-col bg-background p-7 transition-colors hover:bg-surface"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-subtle">
                    {pillar.number}
                  </span>

                  <Icon
                    size={22}
                    strokeWidth={1.4}
                    className="text-accent transition-transform group-hover:-translate-y-1"
                  />
                </div>

                <div className="mt-auto">
                  <h3 className="font-display text-2xl">{pillar.title}</h3>

                  <p className="mt-4 text-sm leading-7 text-muted">
                    {pillar.description}
                  </p>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-l-2 border-accent pl-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-display text-xl italic text-foreground">
            Build People. Empower Collaboration. Revive Civilization.
          </p>

          <span className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-accent">
            The Center Philosophy
            <ArrowRight size={14} />
          </span>
        </div>
      </Container>
    </Section>
  );
}
