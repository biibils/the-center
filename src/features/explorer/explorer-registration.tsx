"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  KeyRound,
  Mail,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AmbientSoundToggle,
  playCinematicSfx,
} from "@/components/shared/ambient-sound-toggle";
import { SeamlessLoopVideo } from "@/components/shared/seamless-loop-video";
import { TheCenterLogo } from "@/components/shared/the-center-logo";
import { createClient } from "@/lib/supabase/client";
import { syncAllExplorerData } from "@/lib/supabase/session";
import { CinematicPreloader } from "@/components/shared/cinematic-preloader";

type ExplorerProfile = {
  displayName: string;
  username: string;
  bio: string;
  motivation: string;
  curiosity: string;
  intention: string;
  createdAt: string;
};

type RegistrationFormState = {
  email: string;
  password: string;
  displayName: string;
  username: string;
  bio: string;
  motivation: string;
  curiosity: string;
  intention: string;
};

type FormFieldKey = keyof RegistrationFormState;

interface RegistrationStep {
  id: string;
  sectionCode: string;
  sectionTitle: string;
  type: "intro" | "input" | "textarea" | "outro" | "credentials";
  field?: FormFieldKey;
  title: string;
  description?: string;
  hint?: string;
  placeholder?: string;
  required?: boolean;
  rows?: number;
  ctaLabel: string;
}

const REGISTRATION_STEPS: RegistrationStep[] = [
  {
    id: "intro",
    sectionCode: "INTERLUDE",
    sectionTitle: "Becoming the Explorer",
    type: "intro",
    title: "Sebelum Memulai Perjalanan",
    description:
      "Setiap perjalanan memiliki titik awal. Sebelum melangkah lebih jauh, mari kenali siapa dirimu, apa yang membawamu ke sini, dan apa yang ingin kamu temukan.",
    ctaLabel: "Siapkan Identitas",
  },
  {
    id: "displayName",
    sectionCode: "BAGIAN I · IDENTITAS",
    sectionTitle: "Langkah 01 / 07",
    type: "input",
    field: "displayName",
    title: "Siapa nama penjelajahmu?",
    description:
      "Kamu tidak perlu menggunakan nama asli. Pilih identitas yang ingin kamu gunakan selama menjelajahi The Center.",
    placeholder: "Pilih nama samaran untuk perjalananmu...",
    required: true,
    ctaLabel: "Lanjutkan",
  },
  {
    id: "username",
    sectionCode: "BAGIAN I · IDENTITAS",
    sectionTitle: "Langkah 02 / 07",
    type: "input",
    field: "username",
    title: "Tentukan tanda pengenalmu",
    description:
      "Gunakan 3–30 karakter: huruf kecil, angka, atau garis bawah (_).",
    placeholder: "contoh: explorer01",
    required: true,
    ctaLabel: "Lanjutkan",
  },
  {
    id: "credentials",
    sectionCode: "BAGIAN I · SEGEL AKUN",
    sectionTitle: "Langkah 03 / 07",
    type: "credentials",
    title: "Amankan Arsip Perjalananmu",
    description:
      "Gunakan email aktif dan kata sandi agar progres XP, penemuan, dan jurnalmu tetap tersimpan lintas perangkat.",
    required: true,
    ctaLabel: "Lanjutkan",
  },
  {
    id: "bio",
    sectionCode: "BAGIAN I · IDENTITAS",
    sectionTitle: "Langkah 04 / 07",
    type: "textarea",
    field: "bio",
    title: "Sedikit tentang dirimu",
    description:
      "Ceritakan secara singkat siapa dirimu saat ini. Langkah ini bersifat opsional.",
    hint: "Hindari mencantumkan informasi pribadi seperti nama asli, alamat, atau nomor kontak.",
    placeholder: "Ceritakan sedikit tentang dirimu...",
    required: false,
    rows: 3,
    ctaLabel: "Lanjutkan",
  },
  {
    id: "motivation",
    sectionCode: "BAGIAN II · REFLEKSI",
    sectionTitle: "Langkah 05 / 07",
    type: "textarea",
    field: "motivation",
    title: "Apa yang mendorongmu untuk memahami Baitul Maqdis lebih jauh?",
    description:
      "Tidak ada jawaban benar atau salah. Jawablah berdasarkan apa yang benar-benar kamu pikirkan.",
    placeholder: "Aku memulai perjalanan ini karena...",
    required: true,
    rows: 4,
    ctaLabel: "Lanjutkan",
  },
  {
    id: "curiosity",
    sectionCode: "BAGIAN II · REFLEKSI",
    sectionTitle: "Langkah 06 / 07",
    type: "textarea",
    field: "curiosity",
    title:
      "Jika kamu memiliki kesempatan menelusuri masa lalu, hal apa yang paling ingin kamu temukan?",
    placeholder: "Hal yang paling ingin aku temukan adalah...",
    required: true,
    rows: 4,
    ctaLabel: "Lanjutkan",
  },
  {
    id: "intention",
    sectionCode: "BAGIAN II · REFLEKSI",
    sectionTitle: "Langkah 07 / 07",
    type: "textarea",
    field: "intention",
    title:
      "Setelah memahami kisah yang akan kamu temukan, kontribusi apa yang ingin kamu bawa kembali ke masa kini?",
    placeholder: "Aku berharap suatu hari bisa...",
    required: true,
    rows: 4,
    ctaLabel: "Lanjutkan",
  },
  {
    id: "outro",
    sectionCode: "KOMITMEN PENJELAJAH",
    sectionTitle: "Siap Melangkah",
    type: "outro",
    title: "Langkah Pertama Telah Ditetapkan",
    description:
      "Perjalananmu dimulai sebagai seorang Explorer. Bukan karena kamu sudah mengetahui segalanya, melainkan karena kamu bersedia untuk mencari, memahami, dan bertumbuh.",
    ctaLabel: "Segel & Mulai Menjelajah",
  },
];

export function ExplorerRegistration() {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isCheckingStep, setIsCheckingStep] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingEmailVerification, setPendingEmailVerification] =
    useState(false);
  const [isResendingEmail, setIsResendingEmail] = useState(false);
  const [resendNotice, setResendNotice] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState<RegistrationFormState>({
    email: "",
    password: "",
    displayName: "",
    username: "",
    bio: "",
    motivation: "",
    curiosity: "",
    intention: "",
  });

  const stageRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);
  const passwordInputRef = useRef<HTMLInputElement | null>(null);

  const currentStep = REGISTRATION_STEPS[stepIndex] ?? REGISTRATION_STEPS[0];
  const progressPercent = pendingEmailVerification
    ? 100
    : (stepIndex / (REGISTRATION_STEPS.length - 1)) * 100;

  useEffect(() => {
    if (!stageRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        stageRef.current,
        {
          opacity: 0,
          y: 18,
          filter: "blur(6px)",
        },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.75,
          ease: "power3.out",
          onComplete: () => {
            setIsAnimating(false);
            if (inputRef.current) {
              inputRef.current.focus();
            }
          },
        },
      );
    }, stageRef);

    return () => ctx.revert();
  }, [stepIndex, pendingEmailVerification]);

  function updateField(field: FormFieldKey, value: string) {
    if (errorMsg) setErrorMsg(null);
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  const validateCurrentStep = useCallback(async (): Promise<boolean> => {
    if (currentStep.type === "credentials") {
      const emailTrimmed = form.email.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailTrimmed || !emailRegex.test(emailTrimmed)) {
        setErrorMsg("Masukkan alamat email yang valid.");
        return false;
      }

      if (form.password.length < 6) {
        setErrorMsg("Kata sandi minimal terdiri dari 6 karakter.");
        return false;
      }

      return true;
    }

    if (!currentStep.field) return true;
    const rawValue = form[currentStep.field].trim();

    if (currentStep.required && !rawValue) {
      setErrorMsg("Isi jawabanmu terlebih dahulu sebelum melanjutkan.");
      return false;
    }

    if (currentStep.field === "username") {
      const normalized = rawValue.toLowerCase();
      if (normalized.length < 3 || normalized.length > 30) {
        setErrorMsg("Username harus terdiri dari 3 hingga 30 karakter.");
        return false;
      }
      if (!/^[a-z0-9_]+$/.test(normalized)) {
        setErrorMsg(
          "Username hanya boleh berisi huruf, angka, atau garis bawah (_).",
        );
        return false;
      }

      // Cek ketersediaan username lebih awal agar tidak gagal di akhir
      setIsCheckingStep(true);
      try {
        const supabase = createClient();
        const { data: existingUser } = await supabase
          .from("explorer_profiles")
          .select("id")
          .eq("username", normalized)
          .maybeSingle();

        if (existingUser) {
          setErrorMsg(
            "Tanda pengenal (@username) ini sudah digunakan penjelajah lain.",
          );
          return false;
        }
      } catch {
        // Jika offline/gagal cek awal, biarkan lanjut dan ditangani saat signUp
      } finally {
        setIsCheckingStep(false);
      }
    }

    return true;
  }, [currentStep, form]);

  const finishRegistration = useCallback(async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setErrorMsg(null);
    playCinematicSfx("portal", 2.0);

    const normalizedUsername = form.username.trim().toLowerCase();
    const trimmedEmail = form.email.trim();

    const profile: ExplorerProfile = {
      displayName: form.displayName.trim(),
      username: normalizedUsername,
      bio: form.bio.trim(),
      motivation: form.motivation.trim(),
      curiosity: form.curiosity.trim(),
      intention: form.intention.trim(),
      createdAt: new Date().toISOString(),
    };

    try {
      const supabase = createClient();

      const { data, error } = await supabase.auth.signUp({
        email: trimmedEmail,
        password: form.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/explorer`,
          data: {
            display_name: profile.displayName,
            username: profile.username,
            bio: profile.bio,
            motivation: profile.motivation,
            curiosity: profile.curiosity,
            intention: profile.intention,
          },
        },
      });

      if (error) {
        setIsSubmitting(false);
        if (
          error.message.toLowerCase().includes("already registered") ||
          error.message.toLowerCase().includes("user already exists")
        ) {
          setErrorMsg(
            "Email ini sudah terdaftar. Silakan masuk melalui halaman Login.",
          );
        } else if (
          error.message.toLowerCase().includes("database error saving new user")
        ) {
          setErrorMsg(
            "Tanda pengenal (@username) sudah digunakan. Silakan kembali ke Langkah 02 untuk menggantinya.",
          );
        } else {
          setErrorMsg(error.message);
        }
        return;
      }

      // Simpan cache lokal sementara
      localStorage.setItem(
        "the-center-explorer-profile",
        JSON.stringify(profile),
      );

      // Jika Confirm Email aktif di Supabase, session akan null hingga user klik tautan email
      if (!data.session) {
        setIsSubmitting(false);
        setPendingEmailVerification(true);
        return;
      }

      // Jika langsung mendapat session aktif, sinkronkan & masuk ke ExplorerHub
      await syncAllExplorerData();

      if (stageRef.current) {
        gsap.to(stageRef.current, {
          opacity: 0,
          scale: 1.03,
          filter: "blur(8px)",
          duration: 0.7,
          ease: "power2.in",
        });
      }

      setTimeout(() => {
        router.push("/explorer");
      }, 850);
    } catch (err) {
      console.error("Unexpected registration error:", err);
      setIsSubmitting(false);
      setErrorMsg("Terjadi gangguan koneksi. Silakan coba beberapa saat lagi.");
    }
  }, [form, isSubmitting, router]);

  const handleResendVerification = async () => {
    if (isResendingEmail) return;
    setIsResendingEmail(true);
    setResendNotice(null);
    playCinematicSfx("hover");

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: form.email.trim(),
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/explorer`,
        },
      });

      if (error) {
        setResendNotice(`Gagal mengirim ulang: ${error.message}`);
      } else {
        setResendNotice("Tautan konfirmasi baru telah dikirim ke emailmu.");
      }
    } finally {
      setIsResendingEmail(false);
    }
  };

  const goToStep = useCallback(
    async (nextIndex: number) => {
      if (isAnimating || isSubmitting || isCheckingStep) return;
      if (nextIndex < 0 || nextIndex >= REGISTRATION_STEPS.length) return;
      if (nextIndex === stepIndex) return;

      if (nextIndex > stepIndex) {
        const isValid = await validateCurrentStep();
        if (!isValid) return;
      }

      setErrorMsg(null);
      setIsAnimating(true);
      playCinematicSfx("transition", 1.9);

      if (!stageRef.current) {
        setStepIndex(nextIndex);
        return;
      }

      gsap.to(stageRef.current, {
        opacity: 0,
        y: nextIndex > stepIndex ? -14 : 14,
        filter: "blur(6px)",
        duration: 0.35,
        ease: "power2.in",
        onComplete: () => {
          setStepIndex(nextIndex);
        },
      });
    },
    [isAnimating, isCheckingStep, isSubmitting, stepIndex, validateCurrentStep],
  );

  const handleNextOrSubmit = useCallback(() => {
    if (stepIndex === REGISTRATION_STEPS.length - 1) {
      void finishRegistration();
    } else {
      void goToStep(stepIndex + 1);
    }
  }, [finishRegistration, goToStep, stepIndex]);

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    if (e.key === "Enter" && currentStep.type === "input") {
      e.preventDefault();
      handleNextOrSubmit();
    } else if (
      e.key === "Enter" &&
      (e.metaKey || e.ctrlKey) &&
      currentStep.type === "textarea"
    ) {
      e.preventDefault();
      handleNextOrSubmit();
    }
  };

  const currentFieldValue = currentStep.field ? form[currentStep.field] : "";

  return (
    <main className="relative flex h-dvh w-full flex-col justify-between overflow-hidden bg-[#070908] px-6 py-10 text-[#f7f3ea] select-none lg:px-12">
      <CinematicPreloader
        subtitle="MENYIAPKAN RUANG PENJELAJAH..."
        images={["/images/explorer/register.webp"]}
        videos={["/videos/explorer/register-loop.mp4"]}
        audios={["/audio/explorer-the-grand-journey.mp3"]}
      />

      {/* =========================================================
          BACKGROUND IMAGE
      ========================================================= */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#070908]">
        <SeamlessLoopVideo
          src="/videos/explorer/register-loop.mp4"
          poster="/images/explorer/register.webp"
          crossfadeSec={0.8}
          className={`object-cover object-[84%_52%] origin-[96%_50%] transition-transform duration-1000 ease-out ${
            isSubmitting || pendingEmailVerification
              ? "scale-[1.18]"
              : "scale-[1.08] sm:scale-[1.11] lg:scale-[1.13]"
          }`}
        />

        <div
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-t from-[#070908]/78 via-[#070908]/40 to-transparent lg:bg-linear-to-l lg:from-[#070908]/68 lg:via-[#070908]/32 lg:to-transparent"
        />

        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-24 bg-linear-to-b from-[#070908]/55 to-transparent"
        />
      </div>

      {/* Bingkai Ornamen Sudut RPG */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-5 z-10 hidden border border-white/15 md:block lg:inset-8"
      >
        <span className="absolute -left-px -top-px h-3.5 w-3.5 border-l border-t border-[#e0be7b]/85" />
        <span className="absolute -right-px -top-px h-3.5 w-3.5 border-r border-t border-[#e0be7b]/85" />
        <span className="absolute -bottom-px -left-px h-3.5 w-3.5 border-b border-l border-[#e0be7b]/85" />
        <span className="absolute -bottom-px -right-px h-3.5 w-3.5 border-b border-r border-[#e0be7b]/85" />
      </div>

      {/* =========================================================
          TOP BAR
      ========================================================= */}
      <header className="relative z-20 flex h-12 items-center justify-between">
        <Link
          href="/prologue"
          onMouseEnter={() => playCinematicSfx("hover")}
          className="group inline-flex items-center gap-2.5 text-white transition-colors hover:text-[#e6c687]"
        >
          <ArrowLeft
            size={14}
            className="text-[#e0be7b] transition-transform duration-300 group-hover:-translate-x-1"
          />
          <TheCenterLogo href="" size="sm" />
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            onMouseEnter={() => playCinematicSfx("hover")}
            className="hidden font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-[#f0d399] underline-offset-4 hover:underline sm:inline"
          >
            Sudah Punya Akun? Masuk
          </Link>

          <AmbientSoundToggle
            audioSrc="/audio/explorer-the-grand-journey.mp3"
            activeTrack={1}
            volume={0.13}
          />
        </div>
      </header>

      {/* =========================================================
          MAIN CONTENT: KIRI TERBUKA (KARAKTER), KANAN FORM INTERAKTIF
      ========================================================= */}
      <section className="relative z-20 mx-auto flex w-full max-w-6xl flex-1 items-center justify-end">
        <div
          ref={stageRef}
          className="relative w-full max-w-xl py-4 lg:mr-2 lg:max-w-lg"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-6 -z-10 backdrop-blur-[2px] mask-[radial-gradient(ellipse_75%_70%_at_50%_50%,black_35%,transparent_85%)]"
          />

          {pendingEmailVerification ? (
            /* =====================================================
               LAYAR MENUNGGU KONFIRMASI EMAIL
            ===================================================== */
            <div>
              <div className="mb-4 flex items-center gap-3">
                <span className="text-[10px] text-[#e0be7b]">◆</span>
                <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.3em] text-[#f5d99e]">
                  VERIFIKASI ARSIP
                </span>
                <span className="text-white/50">·</span>
                <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-stone-100">
                  SEGEL EMAIL TERKIRIM
                </span>
              </div>

              <h1 className="font-display text-3xl leading-[1.3] tracking-[0.04em] text-white [text-shadow:0_2px_16px_rgba(0,0,0,0.95)] sm:text-4xl">
                Periksa Kotak Masuk Emailmu
              </h1>

              <p className="mt-4 font-narrative text-base leading-[1.75] text-stone-100 [text-shadow:0_2px_14px_rgba(0,0,0,0.95)] sm:text-lg">
                Tautan aktivasi penjelajah telah dikirimkan ke{" "}
                <span className="font-semibold text-[#f5d99e]">
                  {form.email.trim()}
                </span>
                . Klik tautan di dalam email tersebut untuk membuka akses ke{" "}
                <span className="italic">Command Sanctuary</span>.
              </p>

              <div className="mt-6 border border-[#e0be7b]/35 bg-[#070908]/65 p-4 backdrop-blur-md">
                <div className="flex items-center gap-3 font-mono text-xs text-[#f5d99e]">
                  <Mail size={15} className="shrink-0 text-[#e0be7b]" />
                  <span>
                    {form.displayName.trim()} (@
                    {form.username.trim().toLowerCase()})
                  </span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-stone-300">
                  Jika email tidak muncul di kotak masuk dalam 1–2 menit,
                  periksa folder <strong className="text-white">Spam</strong>{" "}
                  atau <strong className="text-white">Promosi</strong>.
                </p>
              </div>

              {resendNotice && (
                <p className="mt-3 font-mono text-xs text-[#f5d99e]">
                  ◆ {resendNotice}
                </p>
              )}

              <div className="mt-7 flex flex-wrap items-center gap-4">
                <Link href="/login">
                  <Button
                    type="button"
                    onMouseEnter={() => playCinematicSfx("hover")}
                  >
                    Ke Halaman Login
                    <ArrowRight size={15} />
                  </Button>
                </Link>

                <button
                  type="button"
                  onClick={handleResendVerification}
                  disabled={isResendingEmail}
                  onMouseEnter={() => playCinematicSfx("hover")}
                  className="inline-flex cursor-pointer items-center gap-2 border border-white/20 bg-[#070908]/60 px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.2em] text-stone-200 transition-colors hover:border-[#e0be7b] hover:text-[#f5d99e] disabled:opacity-50"
                >
                  <RefreshCw
                    size={13}
                    className={isResendingEmail ? "animate-spin" : ""}
                  />
                  <span>
                    {isResendingEmail ? "Mengirim..." : "Kirim Ulang Email"}
                  </span>
                </button>
              </div>
            </div>
          ) : (
            /* =====================================================
               FORM LANGKAH DEMI LANGKAH
            ===================================================== */
            <>
              {/* Badge Bagian & Langkah */}
              <div className="mb-4 flex items-center gap-3">
                <span className="text-[10px] text-[#e0be7b] [text-shadow:0_1px_8px_rgba(0,0,0,0.9)]">
                  ◆
                </span>
                <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.3em] text-[#f5d99e] [text-shadow:0_2px_12px_rgba(0,0,0,0.95)]">
                  {currentStep.sectionCode}
                </span>
                <span className="text-white/50">·</span>
                <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-stone-100 [text-shadow:0_2px_12px_rgba(0,0,0,0.95)]">
                  {currentStep.sectionTitle}
                </span>
              </div>

              {/* Judul Pertanyaan */}
              <h1
                className={`font-display leading-[1.3] tracking-[0.04em] text-white [text-shadow:0_2px_16px_rgba(0,0,0,0.95),0_0_28px_rgba(0,0,0,0.75)] ${
                  currentStep.type === "intro" || currentStep.type === "outro"
                    ? "text-3xl sm:text-4xl"
                    : "text-2xl sm:text-[1.85rem]"
                }`}
              >
                {currentStep.title}
              </h1>

              {/* Deskripsi / Pengantar */}
              {currentStep.description && (
                <p className="mt-4 font-narrative text-base leading-[1.75] text-stone-100 [text-shadow:0_2px_14px_rgba(0,0,0,0.95),0_1px_3px_rgba(0,0,0,0.9)] sm:text-lg">
                  {currentStep.description}
                </p>
              )}

              {/* Ringkasan Identitas Singkat di Step Terakhir */}
              {currentStep.type === "outro" && form.displayName && (
                <div className="mt-6 space-y-1.5 border-y border-[#e0be7b]/40 bg-[#070908]/55 px-4 py-3 backdrop-blur-xs">
                  <div className="flex items-center gap-3">
                    <Sparkles size={15} className="shrink-0 text-[#e0be7b]" />
                    <div className="font-mono text-xs tracking-[0.14em] text-[#f5d99e]">
                      {form.displayName.trim()}{" "}
                      <span className="text-stone-300">
                        (@{form.username.trim().toLowerCase()})
                      </span>
                    </div>
                  </div>
                  <p className="pl-7 font-mono text-[11px] text-stone-300">
                    {form.email.trim()}
                  </p>
                </div>
              )}

              {/* Credentials Step — Email & Password */}
              {currentStep.type === "credentials" && (
                <div className="mt-6 max-w-md space-y-3.5">
                  {/* Email Input */}
                  <div className="group/field relative flex h-11 items-center border border-white/15 bg-[#070908]/55 px-3.5 backdrop-blur-md transition-all duration-300 focus-within:border-[#e0be7b]/70 focus-within:bg-[#070908]/75 focus-within:shadow-[0_0_24px_-6px_rgba(224,190,123,0.35)]">
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute -left-px -top-px h-1.5 w-1.5 border-l border-t border-[#e0be7b]/60 transition-colors group-focus-within/field:border-[#f5d99e]"
                    />
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute -right-px -top-px h-1.5 w-1.5 border-r border-t border-[#e0be7b]/60 transition-colors group-focus-within/field:border-[#f5d99e]"
                    />
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute -bottom-px -left-px h-1.5 w-1.5 border-b border-l border-[#e0be7b]/60 transition-colors group-focus-within/field:border-[#f5d99e]"
                    />
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute -bottom-px -right-px h-1.5 w-1.5 border-b border-r border-[#e0be7b]/60 transition-colors group-focus-within/field:border-[#f5d99e]"
                    />

                    <Mail
                      size={14}
                      className="shrink-0 text-[#e0be7b]/80 transition-colors group-focus-within/field:text-[#f5d99e]"
                    />
                    <span
                      aria-hidden="true"
                      className="mx-3 h-3.5 w-px bg-white/15"
                    />

                    <input
                      ref={(el) => {
                        inputRef.current = el;
                      }}
                      type="email"
                      value={form.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          passwordInputRef.current?.focus();
                        }
                      }}
                      onFocus={() => playCinematicSfx("hover", 1.6)}
                      placeholder="alamat.email@domain.com"
                      autoComplete="email"
                      className="w-full bg-transparent font-sans text-sm tracking-[0.04em] text-[#fdfbf7] placeholder:text-stone-400/60 focus:outline-none select-text sm:text-base"
                    />
                  </div>

                  {/* Password Input */}
                  <div className="group/field relative flex h-11 items-center border border-white/15 bg-[#070908]/55 px-3.5 backdrop-blur-md transition-all duration-300 focus-within:border-[#e0be7b]/70 focus-within:bg-[#070908]/75 focus-within:shadow-[0_0_24px_-6px_rgba(224,190,123,0.35)]">
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute -left-px -top-px h-1.5 w-1.5 border-l border-t border-[#e0be7b]/60 transition-colors group-focus-within/field:border-[#f5d99e]"
                    />
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute -right-px -top-px h-1.5 w-1.5 border-r border-t border-[#e0be7b]/60 transition-colors group-focus-within/field:border-[#f5d99e]"
                    />
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute -bottom-px -left-px h-1.5 w-1.5 border-b border-l border-[#e0be7b]/60 transition-colors group-focus-within/field:border-[#f5d99e]"
                    />
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute -bottom-px -right-px h-1.5 w-1.5 border-b border-r border-[#e0be7b]/60 transition-colors group-focus-within/field:border-[#f5d99e]"
                    />

                    <KeyRound
                      size={14}
                      className="shrink-0 text-[#e0be7b]/80 transition-colors group-focus-within/field:text-[#f5d99e]"
                    />
                    <span
                      aria-hidden="true"
                      className="mx-3 h-3.5 w-px bg-white/15"
                    />

                    <input
                      ref={passwordInputRef}
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={(e) => updateField("password", e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleNextOrSubmit();
                        }
                      }}
                      onFocus={() => playCinematicSfx("hover", 1.6)}
                      placeholder="Kata sandi (minimal 6 karakter)"
                      autoComplete="new-password"
                      className="w-full bg-transparent font-sans text-sm tracking-[0.04em] text-[#fdfbf7] placeholder:text-stone-400/60 focus:outline-none select-text sm:text-base"
                    />

                    <button
                      type="button"
                      onClick={() => {
                        playCinematicSfx("hover");
                        setShowPassword((prev) => !prev);
                      }}
                      aria-label={
                        showPassword
                          ? "Sembunyikan kata sandi"
                          : "Lihat kata sandi"
                      }
                      className="ml-2 shrink-0 cursor-pointer text-stone-400 transition-colors hover:text-[#f5d99e]"
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>

                    <span
                      aria-hidden="true"
                      className={`ml-2 shrink-0 font-mono text-[9px] uppercase tracking-[0.2em] transition-colors ${
                        form.password.length >= 6
                          ? "text-[#e0be7b]"
                          : "text-white/25"
                      }`}
                    >
                      {form.password.length >= 6 ? "SET" : "MIN 6"}
                    </span>
                  </div>
                </div>
              )}

              {/* Input Single-Line — AAA RPG Nameplate Style */}
              {currentStep.type === "input" && currentStep.field && (
                <div className="mt-6 max-w-md">
                  <div className="group/field relative flex h-11 items-center border border-white/15 bg-[#070908]/55 px-3.5 backdrop-blur-md transition-all duration-300 focus-within:border-[#e0be7b]/70 focus-within:bg-[#070908]/75 focus-within:shadow-[0_0_24px_-6px_rgba(224,190,123,0.35)]">
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute -left-px -top-px h-1.5 w-1.5 border-l border-t border-[#e0be7b]/60 transition-colors group-focus-within/field:border-[#f5d99e]"
                    />
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute -right-px -top-px h-1.5 w-1.5 border-r border-t border-[#e0be7b]/60 transition-colors group-focus-within/field:border-[#f5d99e]"
                    />
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute -bottom-px -left-px h-1.5 w-1.5 border-b border-l border-[#e0be7b]/60 transition-colors group-focus-within/field:border-[#f5d99e]"
                    />
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute -bottom-px -right-px h-1.5 w-1.5 border-b border-r border-[#e0be7b]/60 transition-colors group-focus-within/field:border-[#f5d99e]"
                    />

                    <span
                      aria-hidden="true"
                      className="select-none font-mono text-xs text-[#e0be7b]/80 transition-colors group-focus-within/field:text-[#f5d99e]"
                    >
                      {currentStep.field === "username" ? "@" : "◈"}
                    </span>
                    <span
                      aria-hidden="true"
                      className="mx-3 h-3.5 w-px bg-white/15"
                    />

                    <input
                      ref={(el) => {
                        inputRef.current = el;
                      }}
                      type="text"
                      value={currentFieldValue}
                      onChange={(e) =>
                        updateField(currentStep.field!, e.target.value)
                      }
                      onKeyDown={handleKeyDown}
                      onFocus={() => playCinematicSfx("hover", 1.6)}
                      placeholder={currentStep.placeholder}
                      autoComplete="off"
                      className="w-full bg-transparent font-sans text-sm tracking-[0.04em] text-[#fdfbf7] placeholder:text-stone-400/60 focus:outline-none select-text sm:text-base"
                    />

                    <span
                      aria-hidden="true"
                      className={`ml-2 shrink-0 font-mono text-[9px] uppercase tracking-[0.2em] transition-colors ${
                        currentFieldValue.trim()
                          ? "text-[#e0be7b]"
                          : "text-white/25"
                      }`}
                    >
                      {currentFieldValue.trim() ? "SET" : "REQ"}
                    </span>
                  </div>
                </div>
              )}

              {/* Textarea — AAA RPG Chronicle Entry Style */}
              {currentStep.type === "textarea" && currentStep.field && (
                <div className="mt-5 max-w-lg">
                  <div className="group/field relative border border-white/15 bg-[#070908]/55 px-3.5 py-2.5 backdrop-blur-md transition-all duration-300 focus-within:border-[#e0be7b]/70 focus-within:bg-[#070908]/75 focus-within:shadow-[0_0_24px_-6px_rgba(224,190,123,0.35)]">
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute -left-px -top-px h-1.5 w-1.5 border-l border-t border-[#e0be7b]/60 transition-colors group-focus-within/field:border-[#f5d99e]"
                    />
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute -right-px -top-px h-1.5 w-1.5 border-r border-t border-[#e0be7b]/60 transition-colors group-focus-within/field:border-[#f5d99e]"
                    />
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute -bottom-px -left-px h-1.5 w-1.5 border-b border-l border-[#e0be7b]/60 transition-colors group-focus-within/field:border-[#f5d99e]"
                    />
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute -bottom-px -right-px h-1.5 w-1.5 border-b border-r border-[#e0be7b]/60 transition-colors group-focus-within/field:border-[#f5d99e]"
                    />

                    <textarea
                      ref={(el) => {
                        inputRef.current = el;
                      }}
                      rows={currentStep.rows ?? 3}
                      value={currentFieldValue}
                      onChange={(e) =>
                        updateField(currentStep.field!, e.target.value)
                      }
                      onKeyDown={handleKeyDown}
                      onFocus={() => playCinematicSfx("hover", 1.6)}
                      placeholder={currentStep.placeholder}
                      className="w-full resize-none bg-transparent font-sans text-sm leading-relaxed tracking-[0.02em] text-[#fdfbf7] placeholder:text-stone-400/60 focus:outline-none select-text sm:text-[15px]"
                    />
                  </div>

                  {currentStep.hint && (
                    <p className="mt-2 text-[11px] leading-relaxed text-stone-300/85 [text-shadow:0_1px_8px_rgba(0,0,0,0.95)]">
                      {currentStep.hint}
                    </p>
                  )}
                </div>
              )}

              {/* Pesan Validasi Inline */}
              {errorMsg && (
                <p className="mt-3 font-mono text-xs font-medium tracking-[0.08em] text-amber-300 [text-shadow:0_1px_10px_rgba(0,0,0,0.95)]">
                  ◆ {errorMsg}
                </p>
              )}

              {/* Tombol Aksi Langkah */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Button
                  type="button"
                  onClick={handleNextOrSubmit}
                  onMouseEnter={() => playCinematicSfx("hover")}
                  disabled={isAnimating || isSubmitting || isCheckingStep}
                >
                  {isCheckingStep
                    ? "Memeriksa..."
                    : isSubmitting
                      ? "Menyegel Akun..."
                      : currentStep.ctaLabel}
                  {currentStep.type === "outro" ? (
                    <Check size={15} />
                  ) : (
                    <ArrowRight size={15} />
                  )}
                </Button>

                {(currentStep.type === "input" ||
                  currentStep.type === "credentials") && (
                  <span className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-stone-200 [text-shadow:0_1px_8px_rgba(0,0,0,0.95)] sm:inline">
                    atau tekan Enter ↵
                  </span>
                )}
                {currentStep.type === "textarea" && (
                  <span className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-stone-200 [text-shadow:0_1px_8px_rgba(0,0,0,0.95)] sm:inline">
                    Ctrl + Enter ↵
                  </span>
                )}
              </div>
            </>
          )}
        </div>
      </section>

      {/* =========================================================
          BOTTOM BAR: PROGRESS & NAVIGASI MUNDUR
      ========================================================= */}
      <footer className="relative z-20 flex flex-col gap-3">
        <div className="relative h-0.5 w-full bg-white/30 shadow-[0_1px_6px_rgba(0,0,0,0.85)]">
          <div
            style={{ width: `${progressPercent}%` }}
            className="h-full bg-[#e0be7b] transition-all duration-500 ease-out"
          />
          <span
            style={{ left: `${progressPercent}%` }}
            className="pointer-events-none absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rotate-45 border border-white bg-[#e0be7b] shadow-[0_0_8px_rgba(224,190,123,0.9)] transition-all duration-500"
          />
        </div>

        <div className="flex h-7 items-center justify-between font-mono text-[10px] font-medium uppercase tracking-[0.25em] text-white/90 [text-shadow:0_1px_10px_rgba(0,0,0,0.95)]">
          <button
            type="button"
            onClick={() => void goToStep(stepIndex - 1)}
            disabled={
              stepIndex === 0 ||
              isAnimating ||
              isSubmitting ||
              isCheckingStep ||
              pendingEmailVerification
            }
            className="inline-flex cursor-pointer items-center gap-1.5 transition-colors hover:text-[#f0d399] disabled:pointer-events-none disabled:opacity-30"
          >
            <ArrowLeft size={12} className="text-[#e0be7b]" />
            <span>Sebelumnya</span>
          </button>

          <span className="text-[#f5d99e]">
            {pendingEmailVerification
              ? "MENUNGGU KONFIRMASI"
              : `${stepIndex + 1} / ${REGISTRATION_STEPS.length}`}
          </span>

          <span className="hidden text-stone-200 sm:inline">
            {pendingEmailVerification
              ? "Verifikasi Email"
              : currentStep.required === false
                ? "Opsional"
                : "Interlude"}
          </span>
        </div>
      </footer>
    </main>
  );
}
