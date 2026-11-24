"use client";

import { useState, type FormEvent } from "react";
import { Feather } from "lucide-react";
import { addJournalEntry } from "@/features/journal/journal-service";

type ReflectionFormProps = {
  onSaved?: () => void;
};

export function ReflectionForm({ onSaved }: ReflectionFormProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim() || !content.trim()) return;

    addJournalEntry({
      title: title.trim(),
      content: content.trim(),
      category: "reflections",
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
      className="space-y-6 border border-border p-6 sm:p-8"
    >
      <div className="flex items-center gap-3">
        <Feather size={18} className="text-accent" />
        <span className="text-xs uppercase tracking-[0.25em] text-accent">
          Reflection Journal
        </span>
      </div>

      <div>
        <h2 className="font-display text-2xl">Apa yang Kamu Pikirkan?</h2>
        <p className="mt-2 text-sm leading-7 text-muted">
          Tuliskan pemikiran atau pelajaran yang ingin kamu simpan dari
          perjalanan ini.
        </p>
      </div>

      <div>
        <label htmlFor="reflection-title" className="mb-2 block text-sm">
          Judul Refleksi
        </label>
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
          className="w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-accent"
        />
      </div>

      <div>
        <label htmlFor="reflection-content" className="mb-2 block text-sm">
          Catatan Refleksi
        </label>
        <textarea
          id="reflection-content"
          value={content}
          onChange={(event) => {
            setContent(event.target.value);
            setIsSaved(false);
          }}
          placeholder="Tuliskan pemikiranmu di sini..."
          rows={6}
          required
          className="w-full resize-y border border-border bg-background px-4 py-3 text-sm leading-7 outline-none focus:border-accent"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-xs text-muted">
          Refleksi ini tersimpan secara pribadi di perangkatmu.
        </p>

        <button
          type="submit"
          className="bg-accent px-5 py-3 text-sm font-medium text-background transition-colors hover:bg-accent-hover"
        >
          Simpan Refleksi
        </button>
      </div>

      {isSaved && (
        <p role="status" className="text-sm text-accent">
          Refleksimu berhasil disimpan ke Journal.
        </p>
      )}
    </form>
  );
}
