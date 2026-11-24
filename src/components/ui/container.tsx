
import type { HTMLAttributes } from "react";

interface ContainerProps
  extends HTMLAttributes<HTMLDivElement> {
  size?: "default" | "wide" | "narrow";
}

const sizes = {
  default: "max-w-7xl",
  wide: "max-w-[1440px]",
  narrow: "max-w-3xl",
};

export function Container({
  children,
  size = "default",
  className = "",
  ...props
}: ContainerProps) {
  return (
    <div
      className={`mx-auto w-full px-5 sm:px-8 lg:px-12 ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
