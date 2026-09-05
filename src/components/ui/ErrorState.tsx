"use client";

import type { HTMLAttributes } from "react";
import { classNames } from "@/lib/class-names";
import { Button } from "./Button";

interface ErrorStateProps extends HTMLAttributes<HTMLDivElement> {
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export function ErrorState({
  message,
  onRetry,
  retryLabel = "Retry",
  className,
  ...rest
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={classNames(
        "flex flex-col items-center justify-center gap-4 py-16 text-center",
        className,
      )}
      {...rest}
    >
      <p className="text-ink text-[15px] max-w-sm">{message}</p>
      {onRetry ? (
        <div className="w-40">
          <Button variant="ghost" onClick={onRetry}>
            {retryLabel}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
