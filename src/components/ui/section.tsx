import type { HTMLAttributes } from "react";

interface SectionProps extends HTMLAttributes<HTMLElement> {
  spacing?: "default" | "large" | "small";
}

const spacings = {
  default: "py-16 md:py-24",
  large: "py-24 md:py-32",
  small: "py-10 md:py-14",
};

export function Section({
  children,
  spacing = "default",
  className = "",
  ...props
}: SectionProps) {
  return (
    <section className={`${spacings[spacing]} ${className}`} {...props}>
      {children}
    </section>
  );
}
