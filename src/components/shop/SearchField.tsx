"use client";

import { Search, X } from "lucide-react";
import { classNames } from "@/lib/class-names";

interface SearchFieldProps {
  value: string;
  onValueChange: (nextValue: string) => void;
  placeholder?: string;
}

const focusRing =
  "focus-within:ring-2 focus-within:ring-brand-violet focus-within:ring-offset-2 focus-within:ring-offset-surface";

export function SearchField({
  value,
  onValueChange,
  placeholder = "Search products…",
}: SearchFieldProps) {
  return (
    <label
      className={classNames(
        "flex items-center gap-2 h-12 px-4 rounded-pill bg-card border border-hairline shadow-card",
        focusRing,
      )}
    >
      <Search
        className="w-5 h-5 text-ink-faint shrink-0"
        aria-hidden="true"
      />
      <span className="sr-only">Search products</span>
      <input
        type="search"
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-transparent outline-none text-[15px] text-ink placeholder:text-ink-faint"
      />
      {value ? (
        <button
          type="button"
          onClick={() => onValueChange("")}
          aria-label="Clear search"
          className="p-1 -mr-1 rounded-full text-ink-faint hover:text-ink"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      ) : null}
    </label>
  );
}
