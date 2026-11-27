"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { TheCenterLogo } from "@/components/shared/the-center-logo";
import {
  AmbientSoundToggle,
  playCinematicSfx,
} from "@/components/shared/ambient-sound-toggle";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSending) return;

    setIsSending(true);
    setErrorMsg(null);
    playCinematicSfx("portal", 1.8);

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    });

    setIsSending(false);

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    setIsSent(true);
  };

  return (
    <main className="relative flex min-h-dvh w-full flex-col justify-between overflow-hidden bg-[#070908] px-6 py-10 text-[#f7f3ea] lg:px-12">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(224,190,123,0.12),transparent_60%)]" />

      {/* Top Bar */}
      <header className="relative z-20 flex h-12 items-center justify-between">
        <Link
          href="/login"
          onMouseEnter={() => playCinematicSfx("hover")}
          className="group inline-flex items-center gap-2.5 text-white transition-colors hover:text-[#e6c687]"
        >
          <ArrowLeft
            size={14}
            className="text-[#e0be7b] transition-transform group-hover:-translate-x-1"
          />
          <TheCenterLogo href="" size="sm" />
        </Link>

        <AmbientSoundToggle
          audioSrc="/audio/explorer-the-grand-journey.mp3"
          activeTrack={1}
          volume={0.14}
        />
      </header>

      {/* Center Card */}
      <section className="relative z-20 mx-auto w-full max-w-md border border-white/15 bg-[#0b0e0c]/90 p-7 backdrop-blur-md sm:p-9">
        {isSent ? (
          <div>
            <div className="inline-flex h-10 w-10 items-center justify-center border border-[#e0be7b]/50 bg-[#e0be7b]/10 text-[#f5d99e]">
              <CheckCircle2 size={18} />
            </div>

            <h1 className="mt-4 font-display text-3xl text-white">
              Tautan Pemulihan Terkirim
            </h1>

            <p className="mt-3 font-narrative text-sm leading-relaxed text-stone-300">
              Kami telah mengirimkan instruksi pemulihan kata sandi ke{" "}
              <span className="font-semibold text-[#f5d99e]">
                {email.trim()}
              </span>
              . Periksa kotak masuk atau folder spam emailmu.
            </p>

            <div className="mt-7">
              <Link href="/login">
                <Button type="button" className="w-full">
                  Kembali ke Halaman Login
                  <ArrowRight size={15} />
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div>
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.3em] text-[#e0be7b]">
              ◆ ARCHIVE RECOVERY
            </span>
            <h1 className="mt-3 font-display text-3xl text-white">
              Pulihkan Kata Sandi
            </h1>
            <p className="mt-2 font-narrative text-sm leading-relaxed text-stone-300">
              Masukkan alamat email yang terdaftar untuk menerima tautan
              pembuatan kata sandi baru.
            </p>

            <form onSubmit={handleRequestReset} className="mt-6 space-y-4">
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-[0.22em] text-stone-400">
                  Email Penjelajah
                </label>
                <div className="mt-1.5 flex h-11 items-center border border-white/15 bg-[#070908]/75 px-3.5 focus-within:border-[#e0be7b]">
                  <Mail size={14} className="mr-3 text-[#e0be7b]/80" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => playCinematicSfx("hover")}
                    placeholder="explorer@example.com"
                    className="w-full bg-transparent text-sm text-white placeholder:text-stone-500 focus:outline-none"
                  />
                </div>
              </div>

              {errorMsg && (
                <p className="font-mono text-xs text-amber-300">◆ {errorMsg}</p>
              )}

              <Button type="submit" disabled={isSending} className="w-full">
                {isSending ? "Mengirim Tautan..." : "Kirim Tautan Pemulihan"}
                <ArrowRight size={15} />
              </Button>
            </form>
          </div>
        )}
      </section>

      <footer className="relative z-20 text-center font-mono text-[10px] uppercase tracking-[0.24em] text-stone-500">
        THE CENTER · CHRONICLE AUTHENTICATION
      </footer>
    </main>
  );
}
