"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Compass,
  Sparkles,
} from "lucide-react";
import type { InvestigationChallenge } from "./types";

type InvestigationChallengeProps = {
  challenge: InvestigationChallenge;
  onComplete?: () => void;
};

export function InvestigationChallengeExperience({
  challenge,
  onComplete,
}: InvestigationChallengeProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isCompleted, setIsCompleted] = useState(false);

  const currentQuestion = challenge.questions[currentIndex];
  const selectedAnswer = answers[currentQuestion.id];
  const hasAnswered = Boolean(selectedAnswer);

  const correctCount = challenge.questions.filter(
    (question) => answers[question.id] === question.correctAnswer,
  ).length;

  function handleAnswer(optionId: string) {
    if (hasAnswered) return;

    setAnswers((previous) => ({
      ...previous,
      [currentQuestion.id]: optionId,
    }));
  }

  function handleNext() {
    if (!hasAnswered) return;

    if (currentIndex < challenge.questions.length - 1) {
      setCurrentIndex((previous) => previous + 1);
      return;
    }

    setIsCompleted(true);
    onComplete?.();
  }

  function handleRetry() {
    setCurrentIndex(0);
    setAnswers({});
    setIsCompleted(false);
  }

  if (isCompleted) {
    return (
      <section className="border border-border p-8 sm:p-12">
        <div className="mx-auto max-w-2xl text-center">
          <CheckCircle2 size={48} className="mx-auto text-accent" />

          <span className="mt-6 block text-xs uppercase tracking-[0.25em] text-accent">
            Chapter 01 Completed
          </span>

          <h2 className="mt-4 font-display text-3xl sm:text-4xl">
            Perjalanan Pertamamu Selesai
          </h2>

          <p className="mt-5 text-sm leading-8 text-muted">
            {challenge.completionMessage}
          </p>

          <div className="my-8 border-y border-border py-6">
            <p className="font-display text-4xl">
              {correctCount}/{challenge.questions.length}
            </p>
            <p className="mt-2 text-xs uppercase tracking-[0.2em] text-muted">
              Jawaban Benar
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="border border-border bg-surface/40 p-6">
              <Sparkles size={24} className="mx-auto text-accent" />
              <p className="mt-4 font-display text-3xl">+100 XP</p>
              <p className="mt-2 text-xs uppercase tracking-widest text-muted">
                Experience Points
              </p>
            </div>

            <div className="border border-border bg-surface/40 p-6">
              <Compass size={24} className="mx-auto text-accent" />
              <p className="mt-4 font-display text-lg">The First Discovery</p>
              <p className="mt-2 text-xs uppercase tracking-widest text-muted">
                Achievement Unlocked
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/explorer"
              className="inline-flex items-center justify-center gap-2 bg-accent px-6 py-4 text-sm font-medium text-background transition-colors hover:bg-accent-hover"
            >
              Kembali ke Explorer Hub
              <ArrowRight size={16} />
            </Link>

            <button
              onClick={handleRetry}
              className="inline-flex items-center justify-center gap-2 border border-border px-6 py-4 text-sm transition-colors hover:border-accent"
            >
              <RotateCcw size={15} />
              Ulangi Investigasi
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="border border-border p-6 sm:p-10">
      <header className="mb-8">
        <span className="text-xs uppercase tracking-[0.25em] text-accent">
          Investigation Challenge
        </span>

        <h2 className="mt-3 font-display text-2xl sm:text-3xl">
          {challenge.title}
        </h2>

        <p className="mt-2 text-sm italic text-muted">{challenge.subtitle}</p>

        <p className="mt-5 text-sm leading-8 text-muted">
          {challenge.introduction}
        </p>
      </header>

      <div className="mb-8">
        <div className="mb-3 flex items-center justify-between text-xs text-muted">
          <span>
            Pertanyaan {currentIndex + 1} dari {challenge.questions.length}
          </span>
          <span>
            {Math.round(
              ((currentIndex + 1) / challenge.questions.length) * 100,
            )}
            %
          </span>
        </div>

        <div className="h-1 w-full bg-surface">
          <div
            className="h-full bg-accent transition-all"
            style={{
              width: `${((currentIndex + 1) / challenge.questions.length) * 100}%`,
            }}
          />
        </div>
      </div>

      <div className="border-l-2 border-accent bg-surface p-5">
        <span className="text-xs uppercase tracking-[0.2em] text-accent">
          Bukti Investigasi
        </span>

        <p className="mt-3 text-sm leading-7 text-muted">
          {currentQuestion.evidence}
        </p>
      </div>

      <h3 className="mt-8 font-display text-xl leading-relaxed">
        {currentQuestion.question}
      </h3>

      <div className="mt-6 space-y-3">
        {currentQuestion.options.map((option) => {
          const isSelected = selectedAnswer === option.id;
          const isCorrect = option.id === currentQuestion.correctAnswer;

          let optionStyle = "border-border hover:border-accent";

          if (hasAnswered && isCorrect) {
            optionStyle = "border-accent bg-accent/10";
          } else if (isSelected && !isCorrect) {
            optionStyle = "border-red-500 bg-red-500/5";
          }

          return (
            <button
              key={option.id}
              onClick={() => handleAnswer(option.id)}
              disabled={hasAnswered}
              className={`flex w-full items-center gap-4 border p-4 text-left text-sm transition-colors disabled:cursor-default ${optionStyle}`}
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center border border-current text-xs">
                {option.id.toUpperCase()}
              </span>

              <span className="flex-1 leading-7">{option.text}</span>

              {hasAnswered && isCorrect && (
                <CheckCircle2 size={18} className="text-accent" />
              )}

              {isSelected && !isCorrect && (
                <XCircle size={18} className="text-red-500" />
              )}
            </button>
          );
        })}
      </div>

      {hasAnswered && (
        <div className="mt-8 border-t border-border pt-6">
          <span className="text-xs uppercase tracking-[0.2em] text-accent">
            Analisis Bukti
          </span>

          <p className="mt-3 text-sm leading-8 text-muted">
            {currentQuestion.explanation}
          </p>

          <button
            onClick={handleNext}
            className="mt-6 inline-flex items-center gap-2 bg-accent px-5 py-3 text-sm font-medium text-background transition-colors hover:bg-accent-hover"
          >
            {currentIndex === challenge.questions.length - 1
              ? "Selesaikan Investigasi"
              : "Pertanyaan Berikutnya"}
            <ArrowRight size={15} />
          </button>
        </div>
      )}
    </section>
  );
}
