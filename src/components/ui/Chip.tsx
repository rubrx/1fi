import type { HTMLAttributes, ReactNode } from "react";
import { classNames } from "@/lib/class-names";

interface ChipProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
}

export function Chip({ children, className, ...rest }: ChipProps) {
  return (
    <span
      className={classNames(
        "inline-flex items-center rounded-pill bg-chip text-ink-muted text-xs font-medium px-2.5 py-1",
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  );
}
