"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";

type ExplorerProfile = {
  displayName: string;
  username: string;
  bio: string;
  motivation: string;
  curiosity: string;
  intention: string;
  createdAt: string;
};

export function ExplorerRegistration() {
  const router = useRouter();

  const [form, setForm] = useState({
    displayName: "",
    username: "",
    bio: "",
    motivation: "",
    curiosity: "",
    intention: "",
  });

  function updateField(field: keyof typeof form, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const profile: ExplorerProfile = {
      ...form,
      username: form.username.trim().toLowerCase(),
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem(
      "the-center-explorer-profile",
      JSON.stringify(profile),
    );

    router.push("/explorer");
  }

  return (
    <main className="min-h-screen bg-background py-24">
      <Container size="narrow">
        <div className="mb-16">
          <span className="text-xs uppercase tracking-[0.3em] text-accent">
            Interlude — Becoming the Explorer
          </span>

          <h1 className="mt-6 font-display text-4xl leading-tight sm:text-5xl">
            Sebelum Memulai Perjalanan
          </h1>

          <p className="mt-6 text-base leading-8 text-muted">
            Setiap perjalanan memiliki titik awal. Sebelum melangkah lebih jauh,
            mari kenali siapa dirimu, apa yang membawamu ke sini, dan apa yang
            ingin kamu temukan.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-14">
          <section className="space-y-8">
            <div>
              <span className="text-xs uppercase tracking-widest text-accent">
                Bagian I — Identitas
              </span>

              <h2 className="mt-3 font-display text-2xl">Siapa dirimu?</h2>
            </div>

            <div>
              <label className="mb-2 block text-sm">Nama Penjelajah</label>
              <input
                required
                value={form.displayName}
                onChange={(e) => updateField("displayName", e.target.value)}
                placeholder="Pilih nama samaran untuk perjalananmu"
                className="w-full border-b border-border bg-transparent py-3 text-sm outline-none transition-colors focus:border-accent"
              />
              <p className="mt-2 text-xs text-subtle">
                Kamu tidak perlu menggunakan nama asli. Pilih identitas yang
                ingin kamu gunakan selama menjelajahi The Center.
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm">Username</label>
              <input
                required
                minLength={3}
                pattern="[a-zA-Z0-9_]+"
                value={form.username}
                onChange={(e) => updateField("username", e.target.value)}
                placeholder="contoh: explorer01"
                className="w-full border-b border-border bg-transparent py-3 text-sm outline-none transition-colors focus:border-accent"
              />
              <p className="mt-2 text-xs text-subtle">
                Gunakan minimal 3 karakter: huruf, angka, atau garis bawah.
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm">
                Sedikit tentang dirimu (opsional)
              </label>
              <textarea
                rows={3}
                value={form.bio}
                onChange={(e) => updateField("bio", e.target.value)}
                placeholder="Ceritakan sedikit tentang dirimu..."
                className="w-full resize-none border-b border-border bg-transparent py-3 text-sm leading-7 outline-none transition-colors focus:border-accent"
              />
            </div>
            <p className="mt-2 text-xs text-subtle">
              Hindari mencantumkan informasi pribadi seperti nama asli, alamat,
              atau nomor kontak.
            </p>
          </section>

          <section className="space-y-8">
            <div>
              <span className="text-xs uppercase tracking-widest text-accent">
                Bagian II — Refleksi
              </span>

              <h2 className="mt-3 font-display text-2xl">
                Apa yang membawamu ke sini?
              </h2>

              <p className="mt-3 text-sm leading-7 text-muted">
                Tidak ada jawaban benar atau salah. Jawablah berdasarkan apa
                yang benar-benar kamu pikirkan.
              </p>
            </div>

            <div>
              <label className="mb-3 block text-sm leading-6">
                01. Apa yang mendorongmu untuk memahami Baitul Maqdis lebih
                jauh?
              </label>
              <textarea
                required
                rows={4}
                value={form.motivation}
                onChange={(e) => updateField("motivation", e.target.value)}
                placeholder="Aku memulai perjalanan ini karena..."
                className="w-full resize-none border-b border-border bg-transparent py-3 text-sm leading-7 outline-none transition-colors focus:border-accent"
              />
            </div>

            <div>
              <label className="mb-3 block text-sm leading-6">
                02. Jika kamu memiliki kesempatan menelusuri masa lalu, hal apa
                yang paling ingin kamu temukan?
              </label>
              <textarea
                required
                rows={4}
                value={form.curiosity}
                onChange={(e) => updateField("curiosity", e.target.value)}
                placeholder="Hal yang paling ingin aku temukan adalah..."
                className="w-full resize-none border-b border-border bg-transparent py-3 text-sm leading-7 outline-none transition-colors focus:border-accent"
              />
            </div>

            <div>
              <label className="mb-3 block text-sm leading-6">
                03. Setelah memahami kisah yang akan kamu temukan, kontribusi
                apa yang ingin kamu bawa kembali ke masa kini?
              </label>
              <textarea
                required
                rows={4}
                value={form.intention}
                onChange={(e) => updateField("intention", e.target.value)}
                placeholder="Aku berharap suatu hari bisa..."
                className="w-full resize-none border-b border-border bg-transparent py-3 text-sm leading-7 outline-none transition-colors focus:border-accent"
              />
            </div>
          </section>

          <div className="border-t border-border pt-8">
            <p className="mb-8 text-sm leading-7 text-muted">
              Perjalananmu dimulai sebagai seorang Explorer. Bukan karena kamu
              sudah mengetahui segalanya, melainkan karena kamu bersedia untuk
              mencari, memahami, dan bertumbuh.
            </p>

            <button
              type="submit"
              className="inline-flex items-center gap-3 bg-accent px-6 py-4 text-sm font-medium text-background transition-colors hover:bg-accent-hover"
            >
              Mulai Menjelajah
              <ArrowRight size={16} />
            </button>
          </div>
        </form>
      </Container>
    </main>
  );
}
