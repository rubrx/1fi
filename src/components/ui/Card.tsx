import type { HTMLAttributes, ReactNode } from "react";
import { classNames } from "@/lib/class-names";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function Card({ children, className, ...rest }: CardProps) {
  return (
    <div
      className={classNames(
        "bg-card rounded-card border border-hairline shadow-card",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
