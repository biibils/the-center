"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { prologueScenes } from "@/content/prologue";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export function PrologueExperience() {
  const [currentScene, setCurrentScene] = useState(0);
  const router = useRouter();

  const scene = prologueScenes[currentScene];
  const isLastScene = currentScene === prologueScenes.length - 1;

  function handleNext() {
    if (isLastScene) {
      router.push("/explorer/register");
      return;
    }

    setCurrentScene((current) => current + 1);
  }

  function handlePrevious() {
    setCurrentScene((current) => Math.max(0, current - 1));
  }

  return (
    <main className="relative flex min-h-screen items-center overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,rgba(199,166,106,0.08),transparent_60%)]" />
      </div>

      <Container className="relative z-10">
        <div className="mx-auto max-w-3xl py-32">
          <div className="mb-16 flex items-center justify-between">
            <span className="font-display text-sm tracking-[0.2em]">
              THE CENTER
            </span>

            <span className="font-mono text-xs tracking-widest text-subtle">
              {String(currentScene + 1).padStart(2, "0")} /{" "}
              {String(prologueScenes.length).padStart(2, "0")}
            </span>
          </div>

          <div className="mb-10 flex items-center gap-4">
            <span className="h-px w-10 bg-accent" />
            <span className="text-xs uppercase tracking-[0.3em] text-accent">
              {scene.eyebrow}
            </span>
          </div>

          <h1 className="font-display text-4xl leading-tight sm:text-5xl md:text-6xl">
            {scene.title}
          </h1>

          <div className="mt-10 space-y-6">
            {scene.paragraphs.map((paragraph, index) => (
              <p
                key={`${scene.id}-${index}`}
                className="max-w-2xl text-base leading-8 text-muted sm:text-lg sm:leading-9"
              >
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mt-16 flex items-center justify-between border-t border-border pt-8">
            <button
              onClick={handlePrevious}
              disabled={currentScene === 0}
              className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ArrowLeft size={16} />
              Sebelumnya
            </button>

            <Button onClick={handleNext}>
              {isLastScene ? "Lanjutkan" : "Berikutnya"}
              <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      </Container>
    </main>
  );
}
