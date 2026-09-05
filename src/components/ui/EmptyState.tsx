import type { HTMLAttributes } from "react";
import { classNames } from "@/lib/class-names";

interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  message: string;
}

export function EmptyState({ message, className, ...rest }: EmptyStateProps) {
  return (
    <div
      role="status"
      className={classNames(
        "flex items-center justify-center py-16 text-center text-ink-muted text-[15px]",
        className,
      )}
      {...rest}
    >
      {message}
    </div>
  );
}
