"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff, KeyRound } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { syncAllExplorerData } from "@/lib/supabase/session";
import { Button } from "@/components/ui/button";
import { TheCenterLogo } from "@/components/shared/the-center-logo";
import { playCinematicSfx } from "@/components/shared/ambient-sound-toggle";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isUpdating) return;

    if (password.length < 6) {
      setErrorMsg("Kata sandi baru minimal terdiri dari 6 karakter.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Konfirmasi kata sandi tidak cocok.");
      return;
    }

    setIsUpdating(true);
    setErrorMsg(null);
    playCinematicSfx("portal", 1.8);

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setIsUpdating(false);
      setErrorMsg(
        "Sesi pemulihan tidak valid atau sudah kedaluwarsa. Silakan ajukan tautan reset ulang.",
      );
      return;
    }

    await syncAllExplorerData();
    router.refresh();
    router.push("/explorer");
  };

  return (
    <main className="relative flex min-h-dvh w-full flex-col justify-between overflow-hidden bg-[#070908] px-6 py-10 text-[#f7f3ea] lg:px-12">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(224,190,123,0.12),transparent_60%)]" />

      <header className="relative z-20 flex h-12 items-center justify-between">
        <TheCenterLogo href="/" size="sm" />
      </header>

      <section className="relative z-20 mx-auto w-full max-w-md border border-white/15 bg-[#0b0e0c]/90 p-7 backdrop-blur-md sm:p-9">
        <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.3em] text-[#e0be7b]">
          ◆ NEW ACCESS SEAL
        </span>
        <h1 className="mt-3 font-display text-3xl text-white">
          Tetapkan Kata Sandi Baru
        </h1>
        <p className="mt-2 font-narrative text-sm leading-relaxed text-stone-300">
          Buat kata sandi baru untuk mengamankan kembali akses ke arsip
          perjalananmu.
        </p>

        <form onSubmit={handleUpdatePassword} className="mt-6 space-y-4">
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-[0.22em] text-stone-400">
              Kata Sandi Baru
            </label>
            <div className="mt-1.5 flex h-11 items-center border border-white/15 bg-[#070908]/75 px-3.5 transition-colors focus-within:border-[#e0be7b]">
              <KeyRound size={14} className="mr-3 shrink-0 text-[#e0be7b]/80" />
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => playCinematicSfx("hover")}
                placeholder="Minimal 6 karakter"
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

          <div>
            <label className="block font-mono text-[10px] uppercase tracking-[0.22em] text-stone-400">
              Konfirmasi Kata Sandi Baru
            </label>
            <div className="mt-1.5 flex h-11 items-center border border-white/15 bg-[#070908]/75 px-3.5 transition-colors focus-within:border-[#e0be7b]">
              <KeyRound size={14} className="mr-3 shrink-0 text-[#e0be7b]/80" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onFocus={() => playCinematicSfx("hover")}
                placeholder="Ulangi kata sandi baru"
                className="w-full bg-transparent text-sm text-white placeholder:text-stone-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => {
                  playCinematicSfx("hover");
                  setShowConfirmPassword((prev) => !prev);
                }}
                aria-label={
                  showConfirmPassword
                    ? "Sembunyikan konfirmasi kata sandi"
                    : "Lihat konfirmasi kata sandi"
                }
                className="ml-2 shrink-0 cursor-pointer text-stone-400 transition-colors hover:text-[#f5d99e]"
              >
                {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {errorMsg && (
            <p className="font-mono text-xs text-amber-300">◆ {errorMsg}</p>
          )}

          <Button type="submit" disabled={isUpdating} className="w-full">
            {isUpdating ? "Menyimpan..." : "Simpan & Masuk ke Sanctuary"}
            <ArrowRight size={15} />
          </Button>
        </form>
      </section>

      <footer className="relative z-20 text-center font-mono text-[10px] uppercase tracking-[0.24em] text-stone-500">
        THE CENTER · CHRONICLE AUTHENTICATION
      </footer>
    </main>
  );
}
