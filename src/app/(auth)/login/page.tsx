"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  KeyRound,
  Mail,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { syncAllExplorerData } from "@/lib/supabase/session";
import { Button } from "@/components/ui/button";
import { TheCenterLogo } from "@/components/shared/the-center-logo";
import {
  AmbientSoundToggle,
  playCinematicSfx,
} from "@/components/shared/ambient-sound-toggle";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    setErrorMsg(null);
    playCinematicSfx("portal", 1.8);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      setIsLoading(false);
      setErrorMsg(
        error.message.includes("Email not confirmed")
          ? "Email belum dikonfirmasi. Silakan cek kotak masuk atau folder spam emailmu."
          : "Email atau kata sandi tidak sesuai.",
      );
      return;
    }

    await syncAllExplorerData();

    const params = new URLSearchParams(window.location.search);
    const nextPath = params.get("next");
    const safeNext =
      nextPath && nextPath.startsWith("/") && !nextPath.startsWith("//")
        ? nextPath
        : "/explorer";

    router.refresh();
    router.push(safeNext);
  };

  return (
    <main className="relative flex min-h-dvh w-full flex-col justify-between overflow-hidden bg-[#070908] px-6 py-10 text-[#f7f3ea] lg:px-12">
      {/* Ambient Background */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(224,190,123,0.12),transparent_60%)]" />

      {/* Top Bar */}
      <header className="relative z-20 flex h-12 items-center justify-between">
        <Link
          href="/"
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

      {/* Center Login Card */}
      <section className="relative z-20 mx-auto w-full max-w-md border border-white/15 bg-[#0b0e0c]/90 p-7 backdrop-blur-md sm:p-9">
        <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.3em] text-[#e0be7b]">
          ◆ EXPLORER ARCHIVE ACCESS
        </span>
        <h1 className="mt-3 font-display text-3xl text-white">
          Lanjutkan Perjalanan
        </h1>
        <p className="mt-2 font-narrative text-sm leading-relaxed text-stone-300">
          Masuk menggunakan email dan kata sandi untuk memulihkan progres XP,
          Relic, dan catatan jurnalmu.
        </p>

        <form onSubmit={handleLogin} className="mt-6 space-y-4">
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

          <div>
            <div className="flex items-center justify-between">
              <label className="block font-mono text-[10px] uppercase tracking-[0.22em] text-stone-400">
                Kata Sandi
              </label>
              <Link
                href="/forgot-password"
                onMouseEnter={() => playCinematicSfx("hover")}
                className="font-mono text-[10px] tracking-[0.14em] text-[#e0be7b]/85 underline-offset-4 transition-colors hover:text-[#f5d99e] hover:underline"
              >
                Lupa kata sandi?
              </Link>
            </div>

            <div className="mt-1.5 flex h-11 items-center border border-white/15 bg-[#070908]/75 px-3.5 transition-colors focus-within:border-[#e0be7b]">
              <KeyRound size={14} className="mr-3 shrink-0 text-[#e0be7b]/80" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => playCinematicSfx("hover")}
                placeholder="••••••••"
                className="w-full bg-transparent text-sm text-white placeholder:text-stone-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => {
                  playCinematicSfx("hover");
                  setShowPassword((prev) => !prev);
                }}
                aria-label={
                  showPassword ? "Sembunyikan kata sandi" : "Lihat kata sandi"
                }
                className="ml-2 shrink-0 cursor-pointer text-stone-400 transition-colors hover:text-[#f5d99e]"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {errorMsg && (
            <p className="font-mono text-xs text-amber-300">◆ {errorMsg}</p>
          )}

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Memverifikasi Arsip..." : "Masuk ke Sanctuary"}
            <ArrowRight size={15} />
          </Button>
        </form>

        <div className="mt-6 border-t border-white/10 pt-5 text-center font-mono text-[11px] text-stone-400">
          Belum punya identitas penjelajah?{" "}
          <Link
            href="/prologue"
            className="text-[#f5d99e] underline-offset-4 hover:underline"
          >
            Mulai dari Prologue
          </Link>
        </div>
      </section>

      <footer className="relative z-20 text-center font-mono text-[10px] uppercase tracking-[0.24em] text-stone-500">
        THE CENTER · CHRONICLE AUTHENTICATION
      </footer>
    </main>
  );
}
