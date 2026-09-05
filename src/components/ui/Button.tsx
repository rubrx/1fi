import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { classNames } from "@/lib/class-names";

type ButtonVariant = "primary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  pending?: boolean;
  pendingLabel?: string;
  children: ReactNode;
}

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-violet focus-visible:ring-offset-2 focus-visible:ring-offset-surface";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-violet text-white hover:bg-brand-violet/90 active:bg-brand-violet/95 disabled:opacity-60 disabled:cursor-not-allowed",
  ghost:
    "bg-transparent text-ink border border-hairline hover:bg-hairline/60 disabled:opacity-60 disabled:cursor-not-allowed",
};

export function Button({
  variant = "primary",
  pending = false,
  pendingLabel = "Please wait…",
  disabled,
  className,
  children,
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || pending}
      aria-busy={pending || undefined}
      className={classNames(
        "inline-flex items-center justify-center gap-2 h-14 px-6 rounded-button text-[17px] font-semibold w-full",
        "transition-colors",
        focusRing,
        variantClasses[variant],
        className,
      )}
      {...rest}
    >
      {pending ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
          <span>{pendingLabel}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
