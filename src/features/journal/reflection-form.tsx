"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2, Feather, Sparkles } from "lucide-react";
import { addJournalEntry } from "@/features/journal/journal-service";
import { playCinematicSfx } from "@/components/shared/ambient-sound-toggle";
import type { JournalCategory } from "./types";

type ReflectionFormProps = {
  onSaved?: () => void;
};

const QUICK_PROMPTS = [
  {
    label: "Makna Bakkah",
    title: "Pelajaran dari Lembah Tanpa Pepohonan",
    starter:
      "Hal yang paling membekas dari kisah Bakkah adalah bagaimana keberkahan sebuah tempat tidak ditentukan oleh kesuburan alamnya, melainkan...",
  },
  {
    label: "Poros Dua Masjid",
    title: "Keterikatan Masjidil Haram & Al-Aqsa",
    starter:
      "Mengetahui bahwa keduanya terhubung sejak awal sejarah membuatku menyadari bahwa menjaga memori Baitul Maqdis berarti...",
  },
  {
    label: "Sikap Ilmiah",
    title: "Membedakan Dalil & Analisis Sejarah",
    starter:
      "Dari perbedaan pendapat para ulama mengenai peletak fondasi pertama, aku belajar bahwa ketelitian ilmiah dalam Islam...",
  },
];

const MANUAL_CATEGORIES: { id: JournalCategory; label: string }[] = [
  { id: "reflections", label: "Refleksi" },
  { id: "knowledge", label: "Pengetahuan" },
  { id: "clues", label: "Petunjuk" },
];

export function ReflectionForm({ onSaved }: ReflectionFormProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<JournalCategory>("reflections");
  const [isSaved, setIsSaved] = useState(false);

  function applyPrompt(prompt: (typeof QUICK_PROMPTS)[number]) {
    playCinematicSfx("hover");
    setTitle(prompt.title);
    setContent(prompt.starter);
    setCategory("reflections");
    setIsSaved(false);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim() || !content.trim()) return;

    playCinematicSfx("transition");

    addJournalEntry({
      title: title.trim(),
      content: content.trim(),
      category,
      source: "manual",
    });

    setTitle("");
    setContent("");
    setIsSaved(true);
    onSaved?.();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="relative border border-[#e0be7b]/35 bg-[#0b0e0c]/95 p-6 backdrop-blur-md"
    >
      {/* Corner HUD Ticks */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -left-px -top-px h-2.5 w-2.5 border-l-2 border-t-2 border-[#f5d99e]"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-px -top-px h-2.5 w-2.5 border-r-2 border-t-2 border-[#f5d99e]"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-px -left-px h-2.5 w-2.5 border-b-2 border-l-2 border-[#f5d99e]"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-px -right-px h-2.5 w-2.5 border-b-2 border-r-2 border-[#f5d99e]"
      />

      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Feather size={14} className="text-[#e0be7b]" />
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.26em] text-[#f5d99e]">
            SCRIBE&apos;S DESK · NEW ENTRY
          </span>
        </div>
        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-stone-400">
          LOCAL CODEX
        </span>
      </div>

      <h2 className="mt-3 font-display text-2xl text-white">
        Catat Pemikiranmu
      </h2>
      <p className="mt-1.5 font-narrative text-sm leading-relaxed text-stone-300">
        Abadikan hikmah, pertanyaan terbuka, atau kesimpulanmu selama
        menjelajahi sejarah.
      </p>

      {/* Quick Prompt Inspiration Chips */}
      <div className="mt-5">
        <span className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.22em] text-stone-400">
          <Sparkles size={10} className="text-[#e0be7b]" />
          <span>Pemantik Cepat (Klik untuk isi)</span>
        </span>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {QUICK_PROMPTS.map((prompt) => (
            <button
              key={prompt.label}
              type="button"
              onClick={() => applyPrompt(prompt)}
              className="cursor-pointer border border-white/12 bg-[#070908] px-2.5 py-1 font-mono text-[10px] text-stone-300 transition-colors hover:border-[#e0be7b]/60 hover:text-[#f5d99e]"
            >
              + {prompt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category Selector */}
      <div className="mt-5">
        <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-stone-400">
          Kategori Catatan
        </span>
        <div className="mt-2 grid grid-cols-3 gap-1.5">
          {MANUAL_CATEGORIES.map((item) => {
            const active = category === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  playCinematicSfx("hover");
                  setCategory(item.id);
                }}
                className={`cursor-pointer border py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] transition-colors ${
                  active
                    ? "border-[#f5d99e] bg-[#e0be7b]/20 font-semibold text-[#f5d99e]"
                    : "border-white/12 bg-[#070908] text-stone-400 hover:text-stone-200"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Title Input */}
      <div className="mt-5">
        <label
          htmlFor="reflection-title"
          className="block font-mono text-[10px] uppercase tracking-[0.2em] text-stone-400"
        >
          Judul Catatan
        </label>
        <div className="mt-2 flex h-10 items-center border border-white/15 bg-[#070908] px-3 transition-colors focus-within:border-[#e0be7b]">
          <span className="mr-2.5 font-mono text-xs text-[#e0be7b]/80">◆</span>
          <input
            id="reflection-title"
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
              setIsSaved(false);
            }}
            placeholder="Apa yang menarik perhatianmu?"
            maxLength={100}
            required
            className="w-full bg-transparent text-sm text-white placeholder:text-stone-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Content Textarea */}
      <div className="mt-4">
        <label
          htmlFor="reflection-content"
          className="block font-mono text-[10px] uppercase tracking-[0.2em] text-stone-400"
        >
          Isi Refleksi
        </label>
        <div className="mt-2 border border-white/15 bg-[#070908] p-3 transition-colors focus-within:border-[#e0be7b]">
          <textarea
            id="reflection-content"
            value={content}
            onChange={(event) => {
              setContent(event.target.value);
              setIsSaved(false);
            }}
            placeholder="Tuliskan pemikiran atau hikmah yang kamu temukan..."
            rows={5}
            required
            className="w-full resize-y bg-transparent font-narrative text-sm leading-relaxed text-stone-100 placeholder:text-stone-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Submit Row */}
      <div className="mt-5 flex flex-col gap-3">
        <button
          type="submit"
          onMouseEnter={() => playCinematicSfx("hover")}
          className="w-full cursor-pointer border border-[#f5d99e] bg-[#e0be7b] py-3 font-mono text-xs font-bold uppercase tracking-[0.22em] text-[#070908] transition-colors hover:bg-[#f5d99e]"
        >
          Simpan ke Codex
        </button>

        {isSaved && (
          <p
            role="status"
            className="flex items-center justify-center gap-1.5 font-mono text-[11px] text-emerald-300"
          >
            <CheckCircle2 size={13} />
            <span>Catatan berhasil diarsipkan ke Jurnal.</span>
          </p>
        )}
      </div>
    </form>
  );
}
