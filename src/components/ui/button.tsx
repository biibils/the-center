"use client";

import {
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type MouseEvent,
} from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  magnetic?: boolean;
}

const variants: Record<ButtonVariant, { base: string; fill: string }> = {
  primary: {
    base: "bg-accent text-background border border-accent shadow-[0_1px_2px_rgba(0,0,0,0.08)] hover:border-accent-hover hover:shadow-[0_8px_24px_-6px_rgba(150,116,67,0.4)]",
    fill: "bg-accent-hover",
  },
  secondary: {
    base: "bg-surface-elevated text-foreground border border-border hover:border-accent/50",
    fill: "bg-surface",
  },
  outline: {
    base: "bg-transparent text-foreground border border-border hover:border-accent",
    fill: "bg-surface",
  },
  ghost: {
    base: "bg-transparent text-muted border border-transparent hover:text-foreground",
    fill: "bg-surface/80",
  },
};

export function Button({
  children,
  variant = "primary",
  magnetic = true,
  className = "",
  onMouseMove,
  onMouseLeave,
  ...props
}: ButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: MouseEvent<HTMLButtonElement>) => {
    if (magnetic && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      // Tarikan magnetik halus maksimal ±4px
      setOffset({
        x: (e.clientX - centerX) * 0.12,
        y: (e.clientY - centerY) * 0.16,
      });
    }
    onMouseMove?.(e);
  };

  const handleMouseLeave = (e: MouseEvent<HTMLButtonElement>) => {
    if (magnetic) {
      setOffset({ x: 0, y: 0 });
    }
    onMouseLeave?.(e);
  };

  const currentVariant = variants[variant];

  return (
    <button
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
      }}
      className={`group relative inline-flex cursor-pointer items-center justify-center gap-2.5 overflow-hidden rounded-[3px] px-6 py-3.5 text-xs font-medium uppercase tracking-[0.18em] transition-[transform,border-color,box-shadow,color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 ${currentVariant.base} ${className}`}
      {...props}
    >
      {/* Layer 1: Curtain Fill (Mengisi dari bawah ke atas saat hover) */}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 ${currentVariant.fill}`}
      />

      {/* Layer 2: Specular Brass Sheen (Kilau cahaya menyapu diagonal) */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
      />

      {/* Layer 3: Precision Corner Ticks (Muncul halus saat hover) */}
      {variant !== "ghost" && (
        <>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-1 top-1 h-1.5 w-1.5 border-l border-t border-current opacity-0 transition-opacity duration-300 group-hover:opacity-60"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-1 right-1 h-1.5 w-1.5 border-b border-r border-current opacity-0 transition-opacity duration-300 group-hover:opacity-60"
          />
        </>
      )}

      {/* Konten Teks & Ikon dengan Pergeseran Mikro Otomatis */}
      <span className="relative z-10 inline-flex items-center gap-2.5 [&_svg]:transition-transform [&_svg]:duration-300 [&_svg]:ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:[&_svg]:translate-x-1">
        {children}
      </span>
    </button>
  );
}
