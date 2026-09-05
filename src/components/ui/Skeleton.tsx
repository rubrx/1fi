import type { HTMLAttributes } from "react";
import { classNames } from "@/lib/class-names";

type SkeletonProps = HTMLAttributes<HTMLDivElement>;

export function Skeleton({ className, ...rest }: SkeletonProps) {
  return (
    <div
      className={classNames(
        "bg-hairline rounded-card animate-pulse",
        className,
      )}
      aria-hidden="true"
      {...rest}
    />
  );
}
